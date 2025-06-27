import React, { useEffect, useState, useRef } from 'react';
import { Zap, ArrowRight, BookOpen, Coffee, Package, Star, Search, Filter, Bell, Bike, Dumbbell, Users, Utensils, Dog, Car, PartyPopper, GraduationCap, MessageSquare, Shield, HelpCircle, Info, Settings, Menu, ChevronDown, Wallet, ListTodo, Home, User, LogIn, UserPlus, Mail, Award, Trophy, Volume2, Languages } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useGeolocation } from './hooks/useGeolocation';
import { Location } from './lib/locationService';
import TaskMarketplace from './components/TaskMarketplace';
import TaskTemplates from './components/TaskTemplates';
import UserProfile from './components/UserProfile';
import ChatList from './components/ChatList';
import Auth from './components/Auth';
import CreateTask from './components/CreateTask';
import SafetyFeatures from './components/SafetyFeatures';
import FAQSupport from './components/FAQSupport';
import LearnMoreModal from './components/LearnMoreModal';
import NotificationsModal from './components/NotificationsModal';
import WalletModal from './components/WalletModal';
import QuickStartGuide from './components/QuickStartGuide';
import TaskPreview from './components/TaskPreview';
import TaskCheckoutSuccess from './components/TaskCheckoutSuccess';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { subscribeToAuthChanges } from './lib/auth';
import { notificationService } from './lib/database';
import SafeWalkRequestForm from './components/SafeWalkRequestForm';
import VoiceAssistant from './components/VoiceAssistant';
import LanguageSettingsModal from './components/LanguageSettingsModal';
import { useTranslation } from './components/TranslationProvider';

const CATEGORY_GROUPS = [
  {
    name: 'Food & Beverage',
    icon: <Utensils className="w-12 h-12 text-[#FA4616] mb-4" />,
    categories: [
      "Quick coffee runs during study sessions",
      "Meal swipe exchanges",
      "Food delivery from campus dining"
    ],
    image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    name: 'Academic Support',
    icon: <GraduationCap className="w-12 h-12 text-[#FA4616] mb-4" />,
    categories: [
      "Exchange notes from classes",
      "Form new study groups",
      "Get printouts delivered"
    ],
    image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    name: 'Transportation & Travel',
    icon: <Car className="w-12 h-12 text-[#FA4616] mb-4" />,
    categories: [
      "Coordinate quick ride shares to common destinations",
      "Share rides with fellow students to your hometown",
      "Arrange transportation to/from airports"
    ],
    image: "https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    name: 'Fitness & Health',
    icon: <Dumbbell className="w-12 h-12 text-[#FA4616] mb-4" />,
    categories: [
      "Match with new gym buddies",
      "Healthy meal prep help",
      "Workout plan sharing"
    ],
    image: "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    name: 'Pet Care',
    icon: <Dog className="w-12 h-12 text-[#FA4616] mb-4" />,
    categories: [
      "Dog walking services",
      "Pet sitting",
      "Deliver food for pets"
    ],
    image: "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    name: 'Events & Social',
    icon: <PartyPopper className="w-12 h-12 text-[#FA4616] mb-4" />,
    categories: [
      "Event planning assistance",
      "Party supply pickup",
      "Event buddy matching"
    ],
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('templates');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showSafetyFeatures, setShowSafetyFeatures] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showTaskPreview, setShowTaskPreview] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [prefilledLocation, setPrefilledLocation] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showSafeWalk, setShowSafeWalk] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  
  const { location: userLocation, loading: locationLoading, error: locationError } = useGeolocation({
    timeout: 6000,
    enableHighAccuracy: true
  });

  const { currentLanguage } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsInitializing(false);
      
      if (currentUser) {
        setShowAuth(false);
        setShowQuickStart(true);
        checkUnreadNotifications(currentUser.uid);
      } else {
        setCurrentView('templates');
      }
    });

    // Check URL parameters for Stripe checkout success
    const checkStripeParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const taskId = urlParams.get('task_id');
      
      if (success === 'true' && taskId) {
        setSelectedTaskId(taskId);
        setShowCheckoutSuccess(true);
        
        // Clean up URL parameters
        const url = new URL(window.location.href);
        url.searchParams.delete('success');
        url.searchParams.delete('task_id');
        window.history.replaceState({}, '', url.toString());
      }
    };
    
    checkStripeParams();

    // Set up event listeners for custom events
    const handleCreateTask = () => {
      if (user) {
        setShowCreateTask(true);
      } else {
        toast.error('Please sign in to create a task');
        setShowAuth(true);
        setAuthMode('signin');
      }
    };

    const handleViewTasks = () => {
      if (user) {
        setCurrentView('marketplace');
      } else {
        toast.error('Please sign in to browse tasks');
        setShowAuth(true);
        setAuthMode('signin');
      }
    };

    const handleOpenFAQ = () => {
      setShowFAQ(true);
    };

    const handleOpenSupport = () => {
      setShowFAQ(true);
    };

    const handleOpenSafety = () => {
      setShowSafetyFeatures(true);
    };
    
    const handleOpenSafeWalk = () => {
      setShowSafeWalk(true);
    };
    
    const handleOpenWallet = () => {
      if (user) {
        setShowWallet(true);
      } else {
        toast.error('Please sign in to access your wallet');
        setShowAuth(true);
        setAuthMode('signin');
      }
    };
    
    const handleOpenProfile = () => {
      if (user) {
        setCurrentView('profile');
      } else {
        toast.error('Please sign in to view your profile');
        setShowAuth(true);
        setAuthMode('signin');
      }
    };
    
    const handleViewTask = (event: any) => {
      if (event.detail && event.detail.taskId) {
        setSelectedTaskId(event.detail.taskId);
        setCurrentView('marketplace');
      }
    };

    window.addEventListener('create-task', handleCreateTask);
    window.addEventListener('view-tasks', handleViewTasks);
    window.addEventListener('open-faq', handleOpenFAQ);
    window.addEventListener('open-support', handleOpenSupport);
    window.addEventListener('open-safety', handleOpenSafety);
    window.addEventListener('open-safewalk', handleOpenSafeWalk);
    window.addEventListener('open-wallet', handleOpenWallet);
    window.addEventListener('open-profile', handleOpenProfile);
    window.addEventListener('view-task', handleViewTask);

    return () => {
      unsubscribe();
      window.removeEventListener('create-task', handleCreateTask);
      window.removeEventListener('view-tasks', handleViewTasks);
      window.removeEventListener('open-faq', handleOpenFAQ);
      window.removeEventListener('open-support', handleOpenSupport);
      window.removeEventListener('open-safety', handleOpenSafety);
      window.removeEventListener('open-safewalk', handleOpenSafeWalk);
      window.removeEventListener('open-wallet', handleOpenWallet);
      window.removeEventListener('open-profile', handleOpenProfile);
      window.removeEventListener('view-task', handleViewTask);
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      const unsubscribe = notificationService.subscribeToUserNotifications(
        user.uid,
        (notifications) => {
          const unread = notifications.filter(n => !n.read).length;
          setUnreadNotifications(unread);
        }
      );
      
      return () => unsubscribe();
    }
  }, [user]);

  const checkUnreadNotifications = async (userId: string) => {
    try {
      const notifications = await notificationService.getUserNotifications(userId);
      setUnreadNotifications(notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const handleViewTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowCheckoutSuccess(false);
    setCurrentView('marketplace');
  };

  const handleTemplateSelect = (template: any) => {
    if (!user) {
      toast.error('Please sign in to create a task');
      setShowAuth(true);
      setAuthMode('signin');
      return;
    }
    setSelectedTemplate(template);
    setPrefilledLocation(null);
    setShowCreateTask(true);
  };

  const handleTemplateWithLocationSelect = (template: any, location: any) => {
    if (!user) {
      toast.error('Please sign in to create a task');
      setShowAuth(true);
      setAuthMode('signin');
      return;
    }
    setSelectedTemplate(template);
    setPrefilledLocation({
      address: location.address,
      lat: location.coords.lat,
      lng: location.coords.lng
    });
    setShowCreateTask(true);
  };

  const handleLocationSelect = (location: Location) => {
    // This will be handled by the CreateTask component
  };

  const handleProtectedAction = (action: () => void, actionName: string = 'access this feature') => {
    if (!user) {
      toast.error(`Please sign in to ${actionName}`);
      setShowAuth(true);
      setAuthMode('signin');
      return;
    }
    action();
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuth(true);
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setShowAuth(true);
  };

  const handleSafeWalkRequest = () => {
    handleProtectedAction(() => {
      setShowSafeWalk(true);
    }, 'request a SafeWalk');
  };

  const toggleVoiceAssistant = () => {
    setShowVoiceAssistant(!showVoiceAssistant);
  };

  const handleOpenLanguageSettings = () => {
    setShowLanguageSettings(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      {isInitializing ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center mb-4 shadow-lg text-white">
              <Zap className="w-8 h-8" />
            </div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2557]"></div>
          </div>
        </div>
      ) : (
        <>
          <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Left side - Logo and main navigation */}
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setCurrentView('templates')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                      <span className="text-white font-bold text-lg">H</span>
                    </div>
                    <div>
                      <span className="text-xl font-bold text-gray-900 group-hover:text-[#0038FF] transition-colors">Hustl</span>
                      <div className="text-xs text-gray-500">Campus Gigs</div>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center space-x-6">
                    <button
                      onClick={() => setCurrentView('templates')}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentView === 'templates' 
                          ? 'bg-[#0038FF] text-white shadow-md' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      <span>Home</span>
                    </button>
                    
                    <button
                      onClick={() => handleProtectedAction(() => setCurrentView('marketplace'), 'browse tasks')}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentView === 'marketplace' 
                          ? 'bg-[#0038FF] text-white shadow-md' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <ListTodo className="w-4 h-4" />
                      <span>Browse Tasks</span>
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowNavDropdown(!showNavDropdown)}
                        className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors font-semibold"
                      >
                        <Menu className="w-4 h-4" />
                        <span>More</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {showNavDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                          <button
                            onClick={() => {
                              setShowLearnMore(true);
                              setShowNavDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0038FF] flex items-center transition-colors"
                          >
                            <Info className="w-4 h-4 mr-2" />
                            Learn More
                          </button>
                          <button
                            onClick={() => {
                              handleProtectedAction(() => {
                                setShowSafetyFeatures(true);
                                setShowNavDropdown(false);
                              }, 'view safety features');
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0038FF] flex items-center transition-colors"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Safety
                          </button>
                          <button
                            onClick={() => {
                              handleProtectedAction(() => {
                                setShowFAQ(true);
                                setShowNavDropdown(false);
                              }, 'access help');
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0038FF] flex items-center transition-colors"
                          >
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Help
                          </button>
                          <button
                            onClick={() => {
                              handleProtectedAction(() => {
                                setShowWallet(true);
                                setShowNavDropdown(false);
                              }, 'access your wallet');
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0038FF] flex items-center transition-colors"
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            Wallet
                          </button>
                          <button
                            onClick={() => {
                              handleProtectedAction(() => {
                                setCurrentView('chats');
                                setShowNavDropdown(false);
                              }, 'view messages');
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0038FF] flex items-center transition-colors"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Messages
                          </button>
                          <button
                            onClick={() => {
                              handleProtectedAction(() => {
                                handleSafeWalkRequest();
                                setShowNavDropdown(false);
                              }, 'request SafeWalk');
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0038FF] flex items-center transition-colors"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Request SafeWalk
                          </button>
                          <button
                            onClick={() => {
                              toggleVoiceAssistant();
                              setShowNavDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0038FF] flex items-center transition-colors"
                          >
                            <Volume2 className="w-4 h-4 mr-2" />
                            Voice Assistant
                          </button>
                          <button
                            onClick={() => {
                              handleOpenLanguageSettings();
                              setShowNavDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0038FF] flex items-center transition-colors"
                          >
                            <Languages className="w-4 h-4 mr-2" />
                            Language Settings
                          </button>
                          <a
                            href={`mailto:hustlapp@outlook.com?subject=Support Request`}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0038FF] flex items-center transition-colors"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email Support
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - User actions */}
                <div className="flex items-center space-x-4">
                  {/* Language Selector Button */}
                  <button
                    onClick={handleOpenLanguageSettings}
                    className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                    title="Language Settings"
                  >
                    <Languages className="w-5 h-5" />
                  </button>
                  
                  {/* Voice Assistant Button */}
                  <button
                    onClick={toggleVoiceAssistant}
                    className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                    title="Voice Assistant"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  
                  {user ? (
                    <>
                      <div className="relative">
                        <button
                          onClick={() => setShowNotifications(true)}
                          className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                        >
                          <Bell className="w-5 h-5" />
                          {unreadNotifications > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#FA4616] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                              {unreadNotifications}
                            </span>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => setCurrentView('profile')}
                        className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          currentView === 'profile' 
                            ? 'bg-[#0038FF] text-white shadow-md' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">Profile</span>
                      </button>

                      <button 
                        onClick={() => auth.signOut()} 
                        className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 font-semibold"
                      >
                        <span className="hidden sm:inline">Sign Out</span>
                        <span className="sm:hidden">Exit</span>
                      </button>

                      <button 
                        onClick={() => setShowCreateTask(true)}
                        className="btn-gradient-secondary btn-shine px-4 py-2 flex items-center"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Post Task
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSignIn}
                        className="btn-gradient-primary btn-shine px-4 py-2 flex items-center"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        <span>Sign In</span>
                      </button>
                      
                      <button
                        onClick={handleSignUp}
                        className="btn-gradient-secondary btn-shine px-4 py-2 flex items-center"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        <span>Sign Up</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {currentView === 'templates' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <TaskTemplates
                onSelectTemplate={handleTemplateSelect}
                onSelectLocation={handleLocationSelect}
                onSelectTemplateWithLocation={handleTemplateWithLocationSelect}
              />
            </div>
          )}

          {currentView === 'marketplace' && (
            <div>
              {user ? (
                <TaskMarketplace userLocation={userLocation} />
              ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                  <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto border border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                      <LogIn className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
                    <p className="text-gray-600 mb-6">
                      Please sign in to browse and accept tasks from other users.
                    </p>
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={handleSignIn}
                        className="btn-gradient-primary btn-shine px-6 py-2"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={handleSignUp}
                        className="btn-gradient-secondary btn-shine px-6 py-2"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'home' && (
            <>
              <section 
                className="relative text-white py-24 bg-cover bg-center"
                style={{ 
                  backgroundImage: "url('https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center shadow-lg">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">How Hustl Works</h1>
                    <p className="text-xl text-gray-200">
                      Get help or earn money helping others - it's that simple!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Package className="w-12 h-12 text-[#FA4616]" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Post Your Task</h3>
                      <p className="text-gray-200">
                        Describe what you need help with, set your budget, and choose a convenient location on campus.
                      </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Users className="w-12 h-12 text-[#FA4616]" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Get Matched</h3>
                      <p className="text-gray-200">
                        Connect with verified UF students nearby who are ready to help with your task.
                      </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Star className="w-12 h-12 text-[#FA4616]" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Complete & Pay</h3>
                      <p className="text-gray-200">
                        Once your task is done, rate your helper and pay securely through our platform.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4 mt-12">
                    <button 
                      onClick={() => setCurrentView('templates')}
                      className="btn-gradient-secondary btn-shine px-8 py-4 text-lg flex items-center"
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setShowLearnMore(true)}
                      className="bg-white text-[#0F2557] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-200 shadow-md"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </section>

              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-[#FA4616] mr-2" />
                    What You Can Do
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {CATEGORY_GROUPS.map((group, index) => (
                      <div key={index} className="premium-card transform hover:scale-[1.02] transition-all duration-300">
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={group.image}
                            alt={group.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-xl font-bold text-white">{group.name}</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-col items-center mb-4">
                            {group.icon}
                          </div>
                          <ul className="space-y-2">
                            {group.categories.map((category, idx) => (
                              <li key={idx} className="flex items-center">
                                <ArrowRight className="w-4 h-4 text-[#FA4616] mr-2 flex-shrink-0" />
                                <span>{category}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Trusted by UF Students</h2>
                  <p className="text-xl text-gray-600 mb-8">Join thousands of Gators helping Gators every day</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Testimonial
                      quote="Saved me during finals week when I needed a quick coffee run!"
                      author="Sarah M."
                      role="Junior, Engineering"
                    />
                    <Testimonial
                      quote="Great way to earn extra money between classes."
                      author="Mike R."
                      role="Sophomore, Business"
                    />
                    <Testimonial
                      quote="Found a study buddy for my chemistry class in minutes!"
                      author="Jessica L."
                      role="Freshman, Pre-Med"
                    />
                  </div>
                </div>
              </section>
            </>
          )}

          {currentView === 'chats' && (
            <div>
              {user ? (
                <ChatList userId={user.uid} currentUser={user} />
              ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                  <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto border border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
                    <p className="text-gray-600 mb-6">
                      Please sign in to access your messages and chat with other users.
                    </p>
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={handleSignIn}
                        className="btn-gradient-primary btn-shine px-6 py-2"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={handleSignUp}
                        className="btn-gradient-secondary btn-shine px-6 py-2"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {currentView === 'profile' && (
            <div>
              {user ? (
                <UserProfile />
              ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                  <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto border border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                      <User className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
                    <p className="text-gray-600 mb-6">
                      Please sign in to view and manage your profile.
                    </p>
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={handleSignIn}
                        className="btn-gradient-primary btn-shine px-6 py-2"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={handleSignUp}
                        className="btn-gradient-secondary btn-shine px-6 py-2"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {showCreateTask && user && (
            <CreateTask 
              onClose={() => {
                setShowCreateTask(false);
                setSelectedTemplate(null);
                setPrefilledLocation(null);
              }}
              userLocation={userLocation}
              selectedTemplate={selectedTemplate}
              prefilledLocation={prefilledLocation}
            />
          )}

          {showSafetyFeatures && (
            <SafetyFeatures onClose={() => setShowSafetyFeatures(false)} />
          )}

          {showFAQ && (
            <FAQSupport onClose={() => setShowFAQ(false)} />
          )}

          {showLearnMore && (
            <LearnMoreModal onClose={() => setShowLearnMore(false)} />
          )}

          {showNotifications && user && (
            <NotificationsModal onClose={() => setShowNotifications(false)} />
          )}

          {showWallet && user && (
            <WalletModal onClose={() => setShowWallet(false)} />
          )}

          {showQuickStart && user && (
            <QuickStartGuide
              onClose={() => setShowQuickStart(false)}
              onCreateTask={() => {
                setShowQuickStart(false);
                setShowCreateTask(true);
              }}
              onBrowseTasks={() => {
                setShowQuickStart(false);
                setCurrentView('marketplace');
              }}
            />
          )}

          {showTaskPreview && (
            <TaskPreview
              onClose={() => setShowTaskPreview(false)}
              onCreateTask={() => {
                setShowTaskPreview(false);
                setShowCreateTask(true);
              }}
            />
          )}

          {showCheckoutSuccess && selectedTaskId && (
            <TaskCheckoutSuccess
              onClose={() => setShowCheckoutSuccess(false)}
              onViewTask={handleViewTask}
            />
          )}

          {showAuth && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
                <Auth 
                  initialMode={authMode}
                  onClose={() => setShowAuth(false)}
                />
              </div>
            </div>
          )}

          {showSafeWalk && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
              <SafeWalkRequestForm onClose={() => setShowSafeWalk(false)} />
            </div>
          )}

          {showVoiceAssistant && (
            <VoiceAssistant 
              onClose={() => setShowVoiceAssistant(false)} 
              userLocation={userLocation}
            />
          )}

          {showLanguageSettings && (
            <LanguageSettingsModal onClose={() => setShowLanguageSettings(false)} />
          )}

          {/* Floating Voice Assistant Button */}
          <div className="fixed bottom-6 right-6 z-30">
            <button
              onClick={toggleVoiceAssistant}
              className="btn-gradient-primary btn-shine p-4 rounded-full flex items-center justify-center"
              title="Voice Assistant"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          {/* Floating Language Button */}
          <div className="fixed bottom-6 left-6 z-30">
            <button
              onClick={handleOpenLanguageSettings}
              className="bg-white border border-gray-200 shadow-lg p-3 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="Language Settings"
            >
              <Languages className="w-5 h-5 text-[#0038FF]" />
              <span className="ml-2 font-medium text-sm">{currentLanguage.toUpperCase()}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

function Testimonial({ quote, author, role }: any) {
  return (
    <div className="premium-card p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[#0038FF] to-[#0021A5] rounded-full flex items-center justify-center text-white shadow-md">
          <User className="w-5 h-5" />
        </div>
        <div className="ml-3">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-gray-600 italic">"{quote}"</p>
    </div>
  );
}

export default App;