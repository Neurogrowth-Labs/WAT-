import React, { useEffect, lazy, Suspense } from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import { SidebarNav } from './components/SidebarNav';
import { WelcomeDashboardView } from './components/WelcomeDashboardView';
import { ChatList } from './components/ChatList';
import { ChatArea } from './components/ChatArea';
import { DiscoverView } from './components/DiscoverView';
import { AIWorkspaceView } from './components/AIWorkspaceView';
import { YouProfileView } from './components/YouProfileView';
import { BusinessSuiteView } from './components/BusinessSuiteView';
import { CommunitiesView } from './components/CommunitiesView';
import { CallsView } from './components/CallsView';
import { StatusStoriesView } from './components/status/StatusStoriesView';
import { NetworkStatusBar } from './components/NetworkStatusBar';
import { GlassOrbAction } from './components/GlassOrbAction';
import { AuthAndOnboardingFlow } from './components/auth/AuthAndOnboardingFlow';

// Code-split heavy modals and auxiliary views for high performance
const MatrixConferenceView = lazy(() => import('./components/MatrixConferenceView').then(m => ({ default: m.MatrixConferenceView })));
const WebRTCCallModal = lazy(() => import('./components/WebRTCCallModal').then(m => ({ default: m.WebRTCCallModal })));
const StatusViewerModal = lazy(() => import('./components/StatusViewerModal').then(m => ({ default: m.StatusViewerModal })));
const PublishStatusModal = lazy(() => import('./components/status/PublishStatusModal').then(m => ({ default: m.PublishStatusModal })));
const ArchitectureBlueprintModal = lazy(() => import('./components/ArchitectureBlueprintModal').then(m => ({ default: m.ArchitectureBlueprintModal })));
const E2EEVerificationModal = lazy(() => import('./components/E2EEVerificationModal').then(m => ({ default: m.E2EEVerificationModal })));
const UserVerificationServiceModal = lazy(() => import('./components/UserVerificationServiceModal').then(m => ({ default: m.UserVerificationServiceModal })));
const UserSwitcherModal = lazy(() => import('./components/UserSwitcherModal').then(m => ({ default: m.UserSwitcherModal })));
const NewChatModal = lazy(() => import('./components/NewChatModal').then(m => ({ default: m.NewChatModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const JitsiDevOpsHubModal = lazy(() => import('./components/JitsiDevOpsHubModal').then(m => ({ default: m.JitsiDevOpsHubModal })));
const UniversalSearchModal = lazy(() => import('./components/UniversalSearchModal').then(m => ({ default: m.UniversalSearchModal })));
const CommandCenterModal = lazy(() => import('./components/CommandCenterModal').then(m => ({ default: m.CommandCenterModal })));
const BusinessSettingsModal = lazy(() => import('./components/business/BusinessSettingsModal').then(m => ({ default: m.BusinessSettingsModal })));
const OnboardingModal = lazy(() => import('./components/OnboardingModal').then(m => ({ default: m.OnboardingModal })));
const UserProfileModal = lazy(() => import('./components/UserProfileModal').then(m => ({ default: m.UserProfileModal })));
const EditProfileModal = lazy(() => import('./components/EditProfileModal').then(m => ({ default: m.EditProfileModal })));
const KeyboardShortcutsModal = lazy(() => import('./components/KeyboardShortcutsModal').then(m => ({ default: m.KeyboardShortcutsModal })));
const RealTimeCurrencyExchangeModal = lazy(() => import('./components/wallet/RealTimeCurrencyExchangeModal').then(m => ({ default: m.RealTimeCurrencyExchangeModal })));
const WATCheckoutModal = lazy(() => import('./components/checkout/WATCheckoutModal').then(m => ({ default: m.WATCheckoutModal })));
const WATPaymentSuccessModal = lazy(() => import('./components/checkout/WATPaymentSuccessModal').then(m => ({ default: m.WATPaymentSuccessModal })));
const WATPaymentDeclinedModal = lazy(() => import('./components/checkout/WATPaymentDeclinedModal').then(m => ({ default: m.WATPaymentDeclinedModal })));
const WATEmailNotificationViewerModal = lazy(() => import('./components/checkout/WATEmailNotificationViewerModal').then(m => ({ default: m.WATEmailNotificationViewerModal })));
import {
  Home,
  MessageSquare,
  Store,
  User,
} from 'lucide-react';
import { soundEngine } from './utils/audioSynth';

const MainAuthenticatedLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeRoomId,
    setIsUniversalSearchOpen,
    setIsCommandCenterOpen,
    isBusinessSettingsOpen,
    setIsBusinessSettingsOpen,
    businessSettingsSection,
    isOnboardingOpen,
    setIsOnboardingOpen,
    rooms,
    viewingUserProfile,
    setViewingUserProfile,
    isEditProfileOpen,
    setIsEditProfileOpen,
    isKeyboardShortcutsOpen,
    setIsKeyboardShortcutsOpen,
    toggleKeyboardShortcuts,
    toggleBusinessMode,
    setIsSettingsOpen,
    setIsNewChatModalOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutItems,
    isPaymentSuccessOpen,
    setIsPaymentSuccessOpen,
    latestOrder,
    setLatestOrder,
    latestEmailNotification,
    setLatestEmailNotification,
    isPaymentDeclinedOpen,
    setIsPaymentDeclinedOpen,
    declineErrorMessage,
    setDeclineErrorMessage,
    declineOrderId,
    isEmailViewerOpen,
    setIsEmailViewerOpen,
    viewingEmailNotification,
    openEmailViewer,
    isPublishStatusModalOpen,
    setIsPublishStatusModalOpen,
    statusUploadInitialMode,
    stories,
  } = useChat();

  const totalUnread = rooms.reduce((acc, r) => acc + (r.unreadCount || 0), 0);

  // Comprehensive Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (!isCmdOrCtrl) return;

      const key = e.key.toLowerCase();

      if (key === 'k') {
        e.preventDefault();
        setIsUniversalSearchOpen((prev) => !prev);
      } else if (key === 'j') {
        e.preventDefault();
        setIsCommandCenterOpen((prev) => !prev);
      } else if (key === '/' || key === '?') {
        e.preventDefault();
        toggleKeyboardShortcuts();
      } else if (key === 'n' && !e.shiftKey) {
        e.preventDefault();
        setIsNewChatModalOpen(true);
      } else if (key === 'b') {
        e.preventDefault();
        toggleBusinessMode();
      } else if (key === ',' || (key === 's' && e.shiftKey)) {
        e.preventDefault();
        setIsSettingsOpen(true);
      } else if (key === '1') {
        e.preventDefault();
        setActiveTab('dashboard');
        soundEngine.playChime();
      } else if (key === '2') {
        e.preventDefault();
        setActiveTab('chats');
        soundEngine.playChime();
      } else if (key === '3') {
        e.preventDefault();
        setActiveTab('discover');
        soundEngine.playChime();
      } else if (key === '4') {
        e.preventDefault();
        setActiveTab('ai');
        soundEngine.playChime();
      } else if (key === '5') {
        e.preventDefault();
        setActiveTab('business');
        soundEngine.playChime();
      } else if (key === '6') {
        e.preventDefault();
        setActiveTab('you');
        soundEngine.playChime();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setIsUniversalSearchOpen,
    setIsCommandCenterOpen,
    toggleKeyboardShortcuts,
    setIsNewChatModalOpen,
    toggleBusinessMode,
    setIsSettingsOpen,
    setActiveTab,
  ]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F9FAFB] text-neutral-900 overflow-hidden font-sans select-none antialiased relative">
      {/* Network Connectivity & Outbox Queue Status Bar */}
      <NetworkStatusBar />

      <div className="flex-1 flex min-w-0 h-full overflow-hidden relative">
        {/* Subtle ambient light gradient background for glass reflections */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-1/3 w-[30rem] h-[30rem] bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Desktop / Tablet Left Sidebar Navigation */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 flex min-w-0 h-full overflow-hidden relative">
          {/* 0. 🏠 Welcome Dashboard Landing Page */}
          {activeTab === 'dashboard' && <WelcomeDashboardView />}

          {/* 1. 💬 Chats Tab: Split ChatList + ChatArea */}
          {activeTab === 'chats' && (
            <div className="flex-1 flex h-full min-w-0">
              <ChatList />
              <ChatArea />
            </div>
          )}

          {/* 2. ◉ Discover Tab */}
          {activeTab === 'discover' && <DiscoverView />}

          {/* 3. ✦ AI Tab */}
          {activeTab === 'ai' && <AIWorkspaceView />}

          {/* 4. 💼 Business Tab */}
          {activeTab === 'business' && <BusinessSuiteView />}

          {/* 5. ◎ You & Wallet Tab */}
          {activeTab === 'you' && <YouProfileView />}

          {/* Auxiliary Views */}
          {activeTab === 'stories' && <StatusStoriesView />}
          {activeTab === 'communities' && <CommunitiesView />}
          {activeTab === 'calls' && <CallsView />}
          {activeTab === 'conference' && (
            <Suspense fallback={null}>
              <MatrixConferenceView />
            </Suspense>
          )}
        </main>
      </div>

      {/* Signature WAT Glass Orb Action Button */}
      <GlassOrbAction />

      {/* Floating Glass Bottom Navigation Bar (< 768px) with Safe-Area Inset */}
      {(!activeRoomId || activeTab !== 'chats') &&
        activeTab !== 'business' &&
        activeTab !== 'calls' &&
        activeTab !== 'conference' && (
        <div className="md:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] inset-x-4 max-w-sm mx-auto bg-white/85 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.10)] py-1.5 px-2 rounded-full flex items-center justify-around z-40">
          {/* 0. Home */}
          <button
            onClick={() => {
              setActiveTab('dashboard');
              soundEngine.playChime();
            }}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-black text-white shadow-md'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <Home className="w-4 h-4" />
            {activeTab === 'dashboard' && <span className="text-xs font-semibold">Home</span>}
          </button>

          {/* 1. Chats */}
          <button
            onClick={() => {
              setActiveTab('chats');
              soundEngine.playChime();
            }}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all duration-200 ${
              activeTab === 'chats'
                ? 'bg-black text-white shadow-md'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4" />
              {totalUnread > 0 && activeTab !== 'chats' && (
                <span className="absolute -top-1 -right-1.5 px-1 bg-emerald-500 text-white text-[8px] font-black rounded-full min-w-[12px] h-[12px] flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </div>
            {activeTab === 'chats' && <span className="text-xs font-semibold">Chats</span>}
          </button>

          {/* Business */}
          <button
            onClick={() => {
              setActiveTab('business');
              soundEngine.playChime();
            }}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all duration-200 ${
              activeTab === 'business'
                ? 'bg-black text-white shadow-md'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <Store className="w-4 h-4" />
            {activeTab === 'business' && <span className="text-xs font-semibold">Business</span>}
          </button>

          {/* 4. You */}
          <button
            onClick={() => {
              setActiveTab('you');
              soundEngine.playChime();
            }}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all duration-200 ${
              activeTab === 'you'
                ? 'bg-black text-white shadow-md'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" />
            {activeTab === 'you' && <span className="text-xs font-semibold">You</span>}
          </button>
        </div>
      )}

      {/* Global Modals & Overlays (Code-split on demand) */}
      <Suspense fallback={null}>
        <UniversalSearchModal />
        <CommandCenterModal />
        <WebRTCCallModal />
        <StatusViewerModal />
        <PublishStatusModal
          isOpen={isPublishStatusModalOpen}
          onClose={() => setIsPublishStatusModalOpen(false)}
          initialMode={statusUploadInitialMode}
        />
        <ArchitectureBlueprintModal />
        <E2EEVerificationModal />
        <UserVerificationServiceModal />
        <UserSwitcherModal />
        <NewChatModal />
        <SettingsModal />
        <BusinessSettingsModal
          isOpen={isBusinessSettingsOpen}
          onClose={() => setIsBusinessSettingsOpen(false)}
          initialSection={businessSettingsSection}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
        />
        <JitsiDevOpsHubModal />
        <UserProfileModal
          user={viewingUserProfile}
          onClose={() => setViewingUserProfile(null)}
        />
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
        />
        <KeyboardShortcutsModal
          isOpen={isKeyboardShortcutsOpen}
          onClose={() => setIsKeyboardShortcutsOpen(false)}
        />

        {/* Real-Time Currency Exchange & Interbank FX Modal */}
        <RealTimeCurrencyExchangeModal />

        {/* WAT Unified Checkout & Commerce Settlement Modal */}
        <WATCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={checkoutItems}
          onPaymentSuccess={(order, emailNotification) => {
            setLatestOrder(order);
            setLatestEmailNotification(emailNotification);
            setIsPaymentSuccessOpen(true);
          }}
          onPaymentDeclined={(error, orderId, emailNotification) => {
            setDeclineErrorMessage(error);
            setLatestEmailNotification(emailNotification || null);
            setIsPaymentDeclinedOpen(true);
          }}
        />

        {/* WAT Premium Payment Successful Modal */}
        <WATPaymentSuccessModal
          isOpen={isPaymentSuccessOpen}
          onClose={() => setIsPaymentSuccessOpen(false)}
          order={latestOrder}
          emailNotification={latestEmailNotification}
          onViewEmail={(email) => openEmailViewer(email)}
          onContinueShopping={() => {
            setIsPaymentSuccessOpen(false);
            setActiveTab('business');
          }}
        />

        {/* WAT Payment Declined / Failed Modal */}
        <WATPaymentDeclinedModal
          isOpen={isPaymentDeclinedOpen}
          onClose={() => setIsPaymentDeclinedOpen(false)}
          errorMessage={declineErrorMessage}
          orderId={declineOrderId}
          emailNotification={latestEmailNotification}
          onViewEmail={(email) => openEmailViewer(email)}
          onRetryWithDifferentMethod={() => {
            setIsPaymentDeclinedOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        {/* WAT Real-time Transactional Email Notification Viewer */}
        <WATEmailNotificationViewerModal
          isOpen={isEmailViewerOpen}
          onClose={() => setIsEmailViewerOpen(false)}
          email={viewingEmailNotification}
        />
      </Suspense>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { authStatus, onboardingStatus } = useChat();

  // If user is unauthenticated or actively onboarding, render Auth & Onboarding Flow
  if (authStatus === 'UNAUTHENTICATED' || onboardingStatus === 'ONBOARDING_IN_PROGRESS') {
    return <AuthAndOnboardingFlow />;
  }

  return <MainAuthenticatedLayout />;
};

export default function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}
