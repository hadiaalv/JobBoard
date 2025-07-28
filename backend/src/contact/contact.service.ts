import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, ContactStatus } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly mailService: MailService,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    const savedContact = await this.contactRepository.save(contact);

    try {
      await this.mailService.sendContactConfirmationEmail(
        contact.email,
        contact.name
      );
    } catch (error) {
      console.error('Failed to send contact confirmation email:', error);
    }

    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@jobboard.com';
      await this.mailService.sendContactNotificationEmail(
        adminEmail,
        contact.name,
        contact.email,
        contact.message,
        contact.subject
      );
    } catch (error) {
      console.error('Failed to send admin notification email:', error);
    }

    return savedContact;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact message not found');
    }

    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);

    if (updateContactDto.status === ContactStatus.REPLIED && !contact.repliedAt) {
      updateContactDto.repliedAt = new Date().toISOString();
    }

    Object.assign(contact, updateContactDto);
    return this.contactRepository.save(contact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactRepository.remove(contact);
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    read: number;
    replied: number;
    archived: number;
  }> {
    const [total, pending, read, replied, archived] = await Promise.all([
      this.contactRepository.count(),
      this.contactRepository.count({ where: { status: ContactStatus.PENDING } }),
      this.contactRepository.count({ where: { status: ContactStatus.READ } }),
      this.contactRepository.count({ where: { status: ContactStatus.REPLIED } }),
      this.contactRepository.count({ where: { status: ContactStatus.ARCHIVED } }),
    ]);

    return { total, pending, read, replied, archived };
  }
} 