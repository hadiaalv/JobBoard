"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import socketService from "@/lib/socket";
import toast from "react-hot-toast";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: 'new_job' | 'job_updated' | 'job_deleted' | 'application_updated' | 'new_application';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
}

export default function RealTimeNotifications() {
  const { user, isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep only last 10
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    if (!isAuthenticated || !user) {
      socketService.disconnect();
      setIsConnected(false);
      return;
    }

    // Add a small delay to ensure auth is fully initialized
    const timer = setTimeout(() => {
      const socket = socketService.connect();
      if (!socket) {
        setIsConnected(false);
        return;
      }

      // Listen for new job notifications
      socketService.on('new_job', (data) => {
        const notification: Notification = {
          id: `new_job_${data.id}`,
          type: 'new_job',
          title: 'New Job Posted',
          message: `${data.title} at ${data.company}`,
          data,
          timestamp: new Date(),
        };
        
        addNotification(notification);
        
        if (user.role === 'job_seeker') {
          toast.success(`New job: ${data.title} at ${data.company}`, {
            duration: 5000,
            icon: '💼',
          });
        }
      });

      // Listen for job updates
      socketService.on('job_updated', (data) => {
        const notification: Notification = {
          id: `job_updated_${data.id}`,
          type: 'job_updated',
          title: 'Job Updated',
          message: `${data.title} has been updated`,
          data,
          timestamp: new Date(),
        };
        
        addNotification(notification);
      });

      // Listen for job deletions
      socketService.on('job_deleted', (data) => {
        const notification: Notification = {
          id: `job_deleted_${data.id}`,
          type: 'job_deleted',
          title: 'Job Removed',
          message: 'A job has been removed',
          data,
          timestamp: new Date(),
        };
        
        addNotification(notification);
      });

      // Listen for application updates
      socketService.on('application_updated', (data) => {
        const notification: Notification = {
          id: `application_updated_${data.id}`,
          type: 'application_updated',
          title: 'Application Update',
          message: `Your application status: ${data.status}`,
          data,
          timestamp: new Date(),
        };
        
        addNotification(notification);
        
        toast.success(`Application status updated: ${data.status}`, {
          duration: 5000,
          icon: '📝',
        });
      });

      // Listen for new applications (employers only)
      socketService.on('new_application', (data) => {
        if (user.role === 'employer') {
          const notification: Notification = {
            id: `new_application_${data.id}`,
            type: 'new_application',
            title: 'New Application',
            message: `New application for ${data.jobTitle}`,
            data,
            timestamp: new Date(),
          };
          
          addNotification(notification);
          
          toast.success(`New application received for ${data.jobTitle}`, {
            duration: 5000,
            icon: '👤',
          });
        }
      });

      // Add connection status listeners
      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('disconnect', (reason) => {
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

    }, 1000);

    return () => {
      clearTimeout(timer);
      // Clean up event listeners
      socketService.off('new_job');
      socketService.off('job_updated');
      socketService.off('job_deleted');
      socketService.off('application_updated');
      socketService.off('new_application');
      socketService.disconnect();
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  // Don't render on server side
  if (typeof window === 'undefined') {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
        title={isConnected ? 'Connected' : 'Disconnected'}
      >
        <Bell className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-gray-400'}`} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
        {!isConnected && (
          <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs"
                >
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 