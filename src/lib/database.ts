import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  setDoc,
  runTransaction,
  writeBatch,
  DocumentReference
} from 'firebase/firestore';
import { db, auth } from './firebase';

// Task service object
export const taskService = {
  async createTask(taskData: any): Promise<string> {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    // Create chat collection for this task
    await setDoc(doc(db, 'chats', docRef.id), {
      task_id: docRef.id,
      created_at: serverTimestamp()
    });
    
    return docRef.id;
  },

  async getTasks(filters?: any[]): Promise<any[]> {
    let q = query(collection(db, 'tasks'), orderBy('created_at', 'desc'));

    if (filters) {
      filters.forEach(filter => {
        if (filter.field && filter.value) {
          q = query(q, where(filter.field, filter.operator || '==', filter.value));
        }
      });
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getTaskById(taskId: string): Promise<any> {
    const docRef = doc(db, 'tasks', taskId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  },

  async updateTask(taskId: string, updates: any): Promise<void> {
    const docRef = doc(db, 'tasks', taskId);
    await updateDoc(docRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
  },

  async completeTask(taskId: string): Promise<void> {
    const docRef = doc(db, 'tasks', taskId);
    await updateDoc(docRef, {
      status: 'completed',
      completed_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    // Create notification for task completion
    const taskDoc = await getDoc(docRef);
    if (taskDoc.exists()) {
      const taskData = taskDoc.data();
      
      // Notify task creator
      await notificationService.createNotification({
        user_id: taskData.created_by,
        type: 'task',
        title: 'Task Completed',
        content: `Your task "${taskData.title}" has been completed successfully!`,
        task_id: taskId,
        read: false
      });
      
      // Notify task performer
      if (taskData.accepted_by) {
        await notificationService.createNotification({
          user_id: taskData.accepted_by,
          type: 'task',
          title: 'Task Completed',
          content: `The task "${taskData.title}" has been marked as completed.`,
          task_id: taskId,
          read: false
        });
      }
    }
  },

  subscribeToTasks(callback: (tasks: any[]) => void, filters?: any[]) {
    let q = query(collection(db, 'tasks'), orderBy('created_at', 'desc'));

    if (filters) {
      filters.forEach(filter => {
        if (filter.field && filter.value) {
          q = query(q, where(filter.field, filter.operator || '==', filter.value));
        }
      });
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(tasks);
    });

    return unsubscribe;
  }
};

// Profile service object
export const profileService = {
  async getProfile(userId: string): Promise<any> {
    const docRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  },

  async createProfile(userId: string, profileData: any): Promise<void> {
    await setDoc(doc(db, 'profiles', userId), {
      ...profileData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
  },

  async updateProfile(userId: string, updates: any): Promise<void> {
    const docRef = doc(db, 'profiles', userId);
    await updateDoc(docRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
  }
};

// User stats service object
export const userStatsService = {
  async getUserStats(userId: string): Promise<any> {
    const docRef = doc(db, 'user_stats', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  },

  async createUserStats(userId: string, statsData: any): Promise<void> {
    await setDoc(doc(db, 'user_stats', userId), {
      user_id: userId,
      ...statsData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
  },

  async updateUserStats(userId: string, updates: any): Promise<void> {
    const docRef = doc(db, 'user_stats', userId);
    await updateDoc(docRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
  },

  // Update stats when a task is completed
  async updateStatsOnTaskCompletion(userId: string, taskPrice: number): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const statsRef = doc(db, 'user_stats', userId);
        const statsDoc = await transaction.get(statsRef);
        
        if (statsDoc.exists()) {
          const currentStats = statsDoc.data();
          const newTasksCompleted = (currentStats.tasks_completed || 0) + 1;
          const newTotalEarnings = (currentStats.total_earnings || 0) + taskPrice;
          
          transaction.update(statsRef, {
            tasks_completed: newTasksCompleted,
            total_earnings: newTotalEarnings,
            updated_at: serverTimestamp()
          });
          
          // Add badge for first task completion
          if (newTasksCompleted === 1) {
            const profileRef = doc(db, 'profiles', userId);
            const profileDoc = await transaction.get(profileRef);
            
            if (profileDoc.exists()) {
              const currentBadges = profileDoc.data().badges || [];
              if (!currentBadges.includes('First Task')) {
                transaction.update(profileRef, {
                  badges: [...currentBadges, 'First Task'],
                  updated_at: serverTimestamp()
                });
              }
            }
          }
          
          // Add badge for completing 5 tasks
          if (newTasksCompleted === 5) {
            const profileRef = doc(db, 'profiles', userId);
            const profileDoc = await transaction.get(profileRef);
            
            if (profileDoc.exists()) {
              const currentBadges = profileDoc.data().badges || [];
              if (!currentBadges.includes('Task Master')) {
                transaction.update(profileRef, {
                  badges: [...currentBadges, 'Task Master'],
                  updated_at: serverTimestamp()
                });
              }
            }
          }
          
        } else {
          // Create stats if they don't exist
          transaction.set(statsRef, {
            user_id: userId,
            tasks_completed: 1,
            total_earnings: taskPrice,
            points: 0,
            average_rating: 0,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
          });
        }
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }
};

// Task progress service object
export const taskProgressService = {
  async createProgress(progressData: any): Promise<string> {
    const docRef = await addDoc(collection(db, 'task_progress'), {
      ...progressData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return docRef.id;
  },

  async getTaskProgress(taskId: string): Promise<any[]> {
    const q = query(
      collection(db, 'task_progress'),
      where('task_id', '==', taskId),
      orderBy('created_at', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  subscribeToTaskProgress(taskId: string, callback: (progress: any[]) => void) {
    const q = query(
      collection(db, 'task_progress'),
      where('task_id', '==', taskId),
      orderBy('created_at', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const progress = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(progress);
    });

    return unsubscribe;
  }
};

// Location service object
export const locationService = {
  async updateLocation(taskId: string, userId: string, location: any, history: any[] = []): Promise<string> {
    // Add timestamp to location data
    const locationWithTimestamp = {
      ...location,
      timestamp: Date.now()
    };
    
    // Use set with merge to update or create the document
    await setDoc(doc(db, 'task_locations', taskId), {
      task_id: taskId,
      user_id: userId,
      location: locationWithTimestamp,
      history: history.length > 0 ? history : undefined,
      updated_at: serverTimestamp()
    }, { merge: true });
    
    return taskId;
  },

  async getTaskLocation(taskId: string): Promise<any> {
    const docRef = doc(db, 'task_locations', taskId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  },

  subscribeToTaskLocation(taskId: string, callback: (location: any) => void) {
    const docRef = doc(db, 'task_locations', taskId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({
          id: docSnap.id,
          ...docSnap.data()
        });
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  },

  async deleteTaskLocation(taskId: string): Promise<void> {
    await deleteDoc(doc(db, 'task_locations', taskId));
  }
};

// Notification service object
export const notificationService = {
  async createNotification(notificationData: any): Promise<string> {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return docRef.id;
  },

  async getUserNotifications(userId: string): Promise<any[]> {
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async markAsRead(notificationId: string): Promise<void> {
    const docRef = doc(db, 'notifications', notificationId);
    await updateDoc(docRef, {
      read: true,
      updated_at: serverTimestamp()
    });
  },

  subscribeToUserNotifications(userId: string, callback: (notifications: any[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(notifications);
    });

    return unsubscribe;
  }
};

// Transaction service object
export const transactionService = {
  async createTransaction(transactionData: any): Promise<string> {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return docRef.id;
  },

  async getUserTransactions(userId: string, limitCount: number = 50): Promise<any[]> {
    const q = query(
      collection(db, 'transactions'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  subscribeToUserTransactions(userId: string, callback: (transactions: any[]) => void) {
    const q = query(
      collection(db, 'transactions'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(transactions);
    });

    return unsubscribe;
  }
};

// Payment method service object
export const paymentMethodService = {
  async addPaymentMethod(userId: string, methodData: any): Promise<string> {
    // Check if this should be the default payment method
    const q = query(
      collection(db, 'payment_methods'),
      where('user_id', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const isDefault = querySnapshot.empty;

    const docRef = await addDoc(collection(db, 'payment_methods'), {
      user_id: userId,
      ...methodData,
      is_default: isDefault,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  },

  async getUserPaymentMethods(userId: string): Promise<any[]> {
    const q = query(
      collection(db, 'payment_methods'),
      where('user_id', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async setDefaultPaymentMethod(userId: string, methodId: string): Promise<void> {
    // First, set all methods to non-default
    const q = query(
      collection(db, 'payment_methods'),
      where('user_id', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    const updatePromises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, { 
        is_default: false,
        updated_at: serverTimestamp()
      })
    );
    
    await Promise.all(updatePromises);

    // Then set the selected method as default
    const docRef = doc(db, 'payment_methods', methodId);
    await updateDoc(docRef, {
      is_default: true,
      updated_at: serverTimestamp()
    });
  },

  async deletePaymentMethod(methodId: string): Promise<void> {
    const docRef = doc(db, 'payment_methods', methodId);
    await deleteDoc(docRef);
  }
};

// Task template service object
export const taskTemplateService = {
  async getTemplates(): Promise<any[]> {
    const q = query(
      collection(db, 'task_templates'),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};

// Message service object
export const messageService = {
  async sendMessage(taskId: string, messageData: any): Promise<string> {
    // Ensure the chat document exists
    await setDoc(doc(db, 'chats', taskId), {
      task_id: taskId,
      updated_at: serverTimestamp()
    }, { merge: true });
    
    // Add the message to the subcollection
    const messagesRef = collection(db, 'chats', taskId, 'messages');
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      created_at: serverTimestamp()
    });
    
    // Update the chat document with latest message info
    await updateDoc(doc(db, 'chats', taskId), {
      last_message: messageData.content,
      last_message_time: serverTimestamp(),
      last_sender: messageData.sender_id
    });
    
    return docRef.id;
  },

  async getMessages(taskId: string): Promise<any[]> {
    // Return empty array if no taskId provided
    if (!taskId || taskId.trim() === '') {
      return [];
    }

    const messagesRef = collection(db, 'chats', taskId, 'messages');
    const q = query(messagesRef, orderBy('created_at', 'asc'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate() || new Date()
    }));
  },

  async markAsRead(taskId: string, messageId: string): Promise<void> {
    const messageRef = doc(db, 'chats', taskId, 'messages', messageId);
    await updateDoc(messageRef, {
      is_read: true
    });
  },

  subscribeToMessages(taskId: string, callback: (messages: any[]) => void) {
    // If no taskId provided, return early with empty messages
    if (!taskId || taskId.trim() === '') {
      callback([]);
      return () => {};
    }

    const messagesRef = collection(db, 'chats', taskId, 'messages');
    const q = query(messagesRef, orderBy('created_at', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date()
      }));
      callback(messages);
    });

    return unsubscribe;
  },
  
  async addReaction(taskId: string, messageId: string, userId: string, emoji: string): Promise<void> {
    const messageRef = doc(db, 'chats', taskId, 'messages', messageId);
    const messageDoc = await getDoc(messageRef);
    
    if (!messageDoc.exists()) {
      throw new Error('Message not found');
    }
    
    const reactions = messageDoc.data().reactions || {};
    
    // Toggle reaction
    if (reactions[userId] === emoji) {
      // Remove reaction
      const { [userId]: removed, ...rest } = reactions;
      await updateDoc(messageRef, { reactions: rest });
    } else {
      // Add or update reaction
      await updateDoc(messageRef, {
        reactions: {
          ...reactions,
          [userId]: emoji
        }
      });
    }
  }
};

// Reviews service
export const reviewService = {
  async addReview(reviewData: any): Promise<string> {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      created_at: serverTimestamp()
    });
    
    // Update user's average rating
    await this.updateUserRating(reviewData.user_id);
    
    // Create notification for the user being reviewed
    await notificationService.createNotification({
      user_id: reviewData.user_id,
      type: 'review',
      title: 'New Review Received',
      content: `You've received a ${reviewData.rating}-star review for a recent task.`,
      task_id: reviewData.task_id,
      read: false
    });
    
    return docRef.id;
  },
  
  async getUserReviews(userId: string): Promise<any[]> {
    const q = query(
      collection(db, 'reviews'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },
  
  async getTaskReviews(taskId: string): Promise<any[]> {
    const q = query(
      collection(db, 'reviews'),
      where('task_id', '==', taskId),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },
  
  async updateUserRating(userId: string): Promise<void> {
    const q = query(
      collection(db, 'reviews'),
      where('user_id', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => doc.data());
    
    if (reviews.length === 0) return;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    const statsRef = doc(db, 'user_stats', userId);
    await updateDoc(statsRef, {
      average_rating: averageRating,
      updated_at: serverTimestamp()
    });
  }
};

// Badges service
export const badgeService = {
  async addBadgeToUser(userId: string, badgeName: string): Promise<void> {
    const profileRef = doc(db, 'profiles', userId);
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    const currentBadges = profileDoc.data().badges || [];
    
    // Only add if badge doesn't already exist
    if (!currentBadges.includes(badgeName)) {
      await updateDoc(profileRef, {
        badges: [...currentBadges, badgeName],
        updated_at: serverTimestamp()
      });
      
      // Create notification for badge
      await notificationService.createNotification({
        user_id: userId,
        type: 'achievement',
        title: `🏆 New Badge: ${badgeName}`,
        content: `Congratulations! You've earned the "${badgeName}" badge!`,
        read: false
      });
    }
  },
  
  async getUserBadges(userId: string): Promise<string[]> {
    const profileRef = doc(db, 'profiles', userId);
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      return [];
    }
    
    return profileDoc.data().badges || [];
  }
};