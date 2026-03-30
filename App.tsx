import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Home, 
  Briefcase, 
  User, 
  History, 
  ChevronRight, 
  Menu,
  Navigation,
  Car,
  Package,
  Calendar,
  CreditCard,
  Star,
  ArrowRight,
  X,
  Camera,
  RefreshCw,
  Zap,
  Share2,
  Phone,
  Lock,
  UserPlus,
  ShieldCheck,
  Eye,
  EyeOff,
  ScanFace
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Logo } from './components/Logo';

// --- Types ---
type Screen = 'login' | 'signup' | 'home' | 'search' | 'ride-options' | 'activity' | 'account' | 'driver-signup' | 'wallet' | 'settings' | 'payment-selection' | 'add-payment' | 'ride-tracking' | 'rating' | 'trip-details' | 'edit-profile' | 'reserve' | 'food' | 'referrals' | 'coming-soon';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface Place {
  id: string;
  name: string;
  address: string;
  icon: React.ReactNode;
}

interface Trip {
  id: string;
  date: string;
  destination: string;
  pickup: string;
  price: string;
  status: string;
  isCancelled?: boolean;
  driverName?: string;
  carModel?: string;
  carColor?: string;
  rating?: number;
}

interface RideOption {
  id: string;
  name: string;
  price: number;
  eta: string;
  icon: React.ReactNode;
  description: string;
  surge?: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'wallet';
  label: string;
  last4?: string;
  brand?: string;
}

// --- Constants ---
const RIDE_OPTIONS: RideOption[] = [
  { id: 'uber-x', name: 'Glide X', price: 2400, eta: '3 min', icon: <Car className="w-6 h-6" />, description: 'Affordable, everyday rides', surge: true },
  { id: 'uber-comfort', name: 'Glide X Comfort', price: 3800, eta: '5 min', icon: <Car className="w-6 h-6 text-uber-blue" />, description: 'Newer cars with extra legroom' },
  { id: 'uber-black', name: 'Glide X Black', price: 5500, eta: '8 min', icon: <Car className="w-6 h-6" />, description: 'Premium rides in luxury cars' },
  { id: 'uber-xl', name: 'Glide X XL', price: 4500, eta: '6 min', icon: <Car className="w-6 h-6" />, description: 'Van for up to 6 people', surge: true },
  { id: 'uber-moto', name: 'Glide X Moto', price: 800, eta: '2 min', icon: <Car className="w-6 h-6" />, description: 'Fast and affordable bike rides' },
  { id: 'uber-package', name: 'Glide X Package', price: 1200, eta: '4 min', icon: <Package className="w-6 h-6" />, description: 'Send items across town' },
];

const RECENT_PLACES: Place[] = [
  { id: '1', name: 'Murtala Muhammed Airport', address: 'Airport Rd, Ikeja, Lagos', icon: <Navigation className="w-4 h-4" /> },
  { id: '2', name: 'Lekki Phase 1', address: 'Admiralty Way, Lekki', icon: <MapPin className="w-4 h-4" /> },
  { id: '3', name: 'Victoria Island', address: 'Adetokunbo Ademola St', icon: <MapPin className="w-4 h-4" /> },
];

// --- Components ---

const CameraCapture = ({ onCapture, onCancel }: { onCapture: (img: string) => void, onCancel: () => void }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, 
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
      }
    }
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      <div className="p-6 flex justify-between items-center text-white">
        <button onClick={onCancel} className="p-2 -ml-2">
          <X size={24} />
        </button>
        <h3 className="font-black">Face Verification</h3>
        <div className="w-10" />
      </div>
      
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-10">
            <p className="mb-4">{error}</p>
            <button onClick={onCancel} className="bg-white text-black px-6 py-2 rounded-full font-bold">Go Back</button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {/* Face Guide Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-80 border-2 border-white/50 rounded-[100px] shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]" />
            </div>
          </>
        )}
      </div>

      <div className="p-10 flex justify-center items-center gap-8 bg-black">
        <canvas ref={canvasRef} className="hidden" />
        {!error && (
          <button 
            onClick={takePhoto}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <div className="w-16 h-16 border-4 border-black rounded-full" />
          </button>
        )}
      </div>
    </div>
  );
};

const ADDRESS_SUGGESTIONS = [
  { id: 's1', name: 'Murtala Muhammed International Airport', address: 'Airport Rd, Ikeja, Lagos', icon: <Navigation className="w-4 h-4" /> },
  { id: 's2', name: 'Lekki Conservation Centre', address: 'Lekki-Epe Expy, Lekki', icon: <MapPin className="w-4 h-4" /> },
  { id: 's3', name: 'The Palms Shopping Mall', address: '1 Bisway St, Maroko, Lekki', icon: <MapPin className="w-4 h-4" /> },
  { id: 's4', name: 'Eko Hotels & Suites', address: 'Plot 1415 Adetokunbo Ademola St, Victoria Island', icon: <MapPin className="w-4 h-4" /> },
  { id: 's5', name: 'Nike Art Center', address: '2 Elegushi Beach Rd, Lekki Phase I', icon: <MapPin className="w-4 h-4" /> },
  { id: 's6', name: 'National Museum Lagos', address: 'Onikan Rd, Ikoyi, Lagos', icon: <MapPin className="w-4 h-4" /> },
  { id: 's7', name: 'Freedom Park', address: 'Hospital Rd, Lagos Island', icon: <MapPin className="w-4 h-4" /> },
  { id: 's8', name: 'Ikeja City Mall', address: 'Obafemi Awolowo Way, Ikeja', icon: <MapPin className="w-4 h-4" /> },
  { id: 's9', name: 'Banana Island', address: 'Ikoyi, Lagos', icon: <MapPin className="w-4 h-4" /> },
  { id: 's10', name: 'Tarkwa Bay Beach', address: 'Lagos Island, Lagos', icon: <MapPin className="w-4 h-4" /> },
];

const MapBackground = () => {
  const [scale, setScale] = useState(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [lastDist, setLastDist] = useState<number | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.5), 4));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastDist !== null) {
        const delta = dist / lastDist;
        setScale(prev => Math.min(Math.max(prev * delta, 0.5), 4));
      }
      setLastDist(dist);
    }
  };

  const handleTouchEnd = () => {
    setLastDist(null);
  };

  return (
    <div 
      className="absolute inset-0 bg-[#e5e3df] dark:bg-[#242f3e] overflow-hidden z-0 touch-none"
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div 
        drag
        dragElastic={0.1}
        dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
        style={{ x, y, scale }}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Grid Pattern for Streets */}
        <div className="absolute inset-0 opacity-40 dark:opacity-20" style={{ 
          backgroundImage: `
            linear-gradient(to right, #fff 2px, transparent 2px),
            linear-gradient(to bottom, #fff 2px, transparent 2px)
          `, 
          backgroundSize: '100px 100px' 
        }} />
        
        {/* Secondary Streets */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ 
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `, 
          backgroundSize: '25px 25px' 
        }} />

        {/* Parks and Water */}
        <div className="absolute top-[10%] left-[60%] w-40 h-60 bg-[#c5e1a5] dark:bg-[#1b3a1b] rounded-3xl rotate-12 opacity-60" />
        <div className="absolute top-[60%] left-[-10%] w-80 h-40 bg-[#90caf9] dark:bg-[#0e2a47] rounded-full -rotate-6 opacity-40" />
        <div className="absolute top-[40%] left-[20%] w-20 h-20 bg-[#c5e1a5] dark:bg-[#1b3a1b] rounded-lg rotate-45 opacity-60" />

        {/* Buildings/Blocks */}
        <div className="absolute top-[25%] left-[15%] w-12 h-16 bg-[#d1d1d1] dark:bg-[#38414e] rounded shadow-sm" />
        <div className="absolute top-[28%] left-[18%] w-8 h-10 bg-[#bdbdbd] dark:bg-[#4a5568] rounded shadow-sm" />
        <div className="absolute top-[75%] left-[65%] w-20 h-12 bg-[#d1d1d1] dark:bg-[#38414e] rounded shadow-sm" />
        
        {/* Main Arterial Roads */}
        <div className="absolute top-1/3 left-0 w-full h-8 bg-white dark:bg-[#38414e] -rotate-2 shadow-sm flex items-center justify-center">
          <div className="w-full h-[1px] border-t border-dashed border-uber-gray-200 dark:border-uber-gray-500" />
        </div>
        <div className="absolute top-0 left-1/2 w-8 h-full bg-white dark:bg-[#38414e] rotate-3 shadow-sm flex flex-col items-center justify-center">
          <div className="h-full w-[1px] border-l border-dashed border-uber-gray-200 dark:border-uber-gray-500" />
        </div>

        {/* Area Labels */}
        <div className="absolute top-[15%] left-[65%] text-[10px] font-bold text-uber-gray-400 dark:text-uber-gray-200 uppercase tracking-widest opacity-50">Lekki Phase 1</div>
        <div className="absolute top-[80%] left-[20%] text-[10px] font-bold text-uber-gray-400 dark:text-uber-gray-200 uppercase tracking-widest opacity-50">Victoria Island</div>
        <div className="absolute top-[45%] left-[5%] text-[10px] font-bold text-uber-gray-400 dark:text-uber-gray-200 uppercase tracking-widest opacity-50">Ikoyi</div>
        
        {/* Simulated Cars */}
        <motion.div 
          animate={{ x: [-50, 500], y: [150, 130] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute z-10 text-xl"
        >
          🚗
        </motion.div>
        <motion.div 
          animate={{ x: [500, -50], y: [280, 310] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute z-10 text-xl"
        >
          🚕
        </motion.div>
        <motion.div 
          animate={{ x: [260, 280], y: [-50, 600] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute z-10 text-xl"
        >
          🚗
        </motion.div>
      </motion.div>
      
      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-20">
        <button 
          onClick={() => setScale(prev => Math.min(prev * 1.2, 4))}
          className="w-10 h-10 bg-white dark:bg-uber-black rounded-full shadow-lg flex items-center justify-center text-xl font-bold border border-uber-gray-100 dark:border-uber-gray-500"
        >
          +
        </button>
        <button 
          onClick={() => setScale(prev => Math.max(prev / 1.2, 0.5))}
          className="w-10 h-10 bg-white dark:bg-uber-black rounded-full shadow-lg flex items-center justify-center text-xl font-bold border border-uber-gray-100 dark:border-uber-gray-500"
        >
          -
        </button>
      </div>
    </div>
  );
};

const BottomNav = ({ activeScreen, setScreen }: { activeScreen: Screen, setScreen: (s: Screen) => void }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-uber-black border-t border-uber-gray-100 dark:border-uber-gray-500 px-6 py-3 flex justify-between items-center z-50 pb-safe">
    <button onClick={() => setScreen('home')} className={`flex flex-col items-center gap-1 ${activeScreen === 'home' ? 'text-uber-black dark:text-white' : 'text-uber-gray-500 dark:text-uber-gray-200'}`}>
      <Home size={24} strokeWidth={activeScreen === 'home' ? 2.5 : 2} />
      <span className="text-[10px] font-bold">Home</span>
    </button>
    <button onClick={() => setScreen('activity')} className={`flex flex-col items-center gap-1 ${activeScreen === 'activity' ? 'text-uber-black dark:text-white' : 'text-uber-gray-500 dark:text-uber-gray-200'}`}>
      <History size={24} strokeWidth={activeScreen === 'activity' ? 2.5 : 2} />
      <span className="text-[10px] font-bold">Activity</span>
    </button>
    <button onClick={() => setScreen('account')} className={`flex flex-col items-center gap-1 ${activeScreen === 'account' ? 'text-uber-black dark:text-white' : 'text-uber-gray-500 dark:text-uber-gray-200'}`}>
      <User size={24} strokeWidth={activeScreen === 'account' ? 2.5 : 2} />
      <span className="text-[10px] font-bold">Account</span>
    </button>
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [screen, setScreen] = useState<Screen>('login');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'otp' | 'password'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleLogin = () => {
    if (loginStep === 'phone') {
      if (phoneNumber.length >= 10) {
        setLoginStep('otp');
      } else {
        showToast('Please enter a valid phone number', 'error');
      }
    } else if (loginStep === 'otp') {
      if (otp === '1234') {
        setLoginStep('password');
      } else {
        showToast('Invalid OTP. Use 1234 for demo.', 'error');
      }
    } else if (loginStep === 'password') {
      if (password.length >= 6) {
        setIsAuthenticated(true);
        setScreen('home');
        showToast('Welcome back to Glide X!', 'success');
      } else {
        showToast('Password must be at least 6 characters', 'error');
      }
    }
  };

  const handleSignup = () => {
    if (username && phoneNumber && password) {
      setUserProfile({
        name: username,
        phone: phoneNumber,
        email: `${username.toLowerCase().replace(/\s+/g, '')}@example.com`
      });
      setIsAuthenticated(true);
      setScreen('home');
      showToast('Account created successfully!', 'success');
    } else {
      showToast('Please fill all fields', 'error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setScreen('login');
    setLoginStep('phone');
    setPhoneNumber('');
    setOtp('');
    setPassword('');
    setUsername('');
    setIsSidebarOpen(false);
  };

  const [availableDrivers, setAvailableDrivers] = useState(Math.floor(Math.random() * 8) + 3);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupQuery, setPickupQuery] = useState('My Current Location');
  const [activeInput, setActiveInput] = useState<'pickup' | 'destination'>('destination');
  const [isOnline, setIsOnline] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'card', label: 'Personal', last4: '4242', brand: 'VISA' },
    { id: '2', type: 'cash', label: 'Cash' },
    { id: '3', type: 'wallet', label: 'Glide X Wallet' },
  ]);
  const [selectedPaymentId, setSelectedPaymentId] = useState('1');
  const [driverPos, setDriverPos] = useState({ x: 0, y: 0 });
  const [stops, setStops] = useState<string[]>(['']); // Multiple stops
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [userProfile, setUserProfile] = useState({
    name: 'Ope Kola',
    phone: '+234 812 345 6789',
    email: 'ope@example.com'
  });
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [driverMessage, setDriverMessage] = useState('');
  const [rideRating, setRideRating] = useState(0);
  const [isRideCheckOpen, setIsRideCheckOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFetchingDriver, setIsFetchingDriver] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [reserveDate, setReserveDate] = useState('');
  const [reserveTime, setReserveTime] = useState('');
  const [trips, setTrips] = useState<Trip[]>([
    { id: '1', date: 'Oct 24, 2:15 PM', destination: 'Lekki Conservation Centre', pickup: 'Home', price: '₦3,200', status: 'Completed', driverName: 'Chinedu', carModel: 'Toyota Corolla', carColor: 'Silver', rating: 5 },
    { id: '2', date: 'Oct 22, 9:05 AM', destination: 'Eko Hotels & Suites', pickup: 'Work', price: '₦2,800', status: 'Completed', driverName: 'Abiola', carModel: 'Honda Civic', carColor: 'Black', rating: 4 },
    { id: '3', date: 'Oct 20, 6:30 PM', destination: 'The Palms Shopping Mall', pickup: 'Home', price: '₦1,500', status: 'Cancelled', isCancelled: true },
  ]);
  const [favorites, setFavorites] = useState<Place[]>(() => {
    try {
      const saved = localStorage.getItem('glide_favorites');
      if (saved && saved !== 'undefined' && saved !== 'null' && saved.trim() !== 'undefined') {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Failed to parse favorites from localStorage:', e);
    }
    return [];
  });

  // Simulate driver movement and Ride Check
  useEffect(() => {
    let interval: any;
    let rideCheckTimeout: any;
    let fetchTimeout: any;
    if (screen === 'ride-tracking') {
      setIsFetchingDriver(true);
      fetchTimeout = setTimeout(() => {
        setIsFetchingDriver(false);
        setDriverPos({ x: 10, y: 10 }); // Start position
      }, 3500); // Simulate 3.5 seconds fetching

      interval = setInterval(() => {
        setDriverPos(prev => ({
          x: prev.x + (Math.random() * 0.5 - 0.2),
          y: prev.y + (Math.random() * 0.5 - 0.2)
        }));
      }, 1000);

      rideCheckTimeout = setTimeout(() => {
        setIsRideCheckOpen(true);
      }, 15000); // Trigger after 15 seconds
    }
    return () => {
      clearInterval(interval);
      clearTimeout(rideCheckTimeout);
      clearTimeout(fetchTimeout);
    };
  }, [screen]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('glide_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Auto-select first ride option when entering ride-options screen
  useEffect(() => {
    if (screen === 'ride-options' && !selectedRide) {
      setSelectedRide(RIDE_OPTIONS[0]);
    }
  }, [screen]);

  const handleSearchFocus = () => {
    setScreen('search');
  };

  const handlePlaceSelect = (place: Place) => {
    if (activeInput === 'destination') {
      setSearchQuery(place.name);
    } else if (activeInput === 'pickup') {
      setPickupQuery(place.name);
    } else {
      // Handle stops
      const index = parseInt(activeInput.split('-')[1]);
      const newStops = [...stops];
      newStops[index] = place.name;
      setStops(newStops);
    }
    setAvailableDrivers(Math.floor(Math.random() * 8) + 3);
    setScreen('ride-options');
  };

  const filteredSuggestions = ADDRESS_SUGGESTIONS.filter(s => {
    let query = '';
    if (activeInput === 'destination') query = searchQuery;
    else if (activeInput === 'pickup') query = pickupQuery;
    else {
      const index = parseInt(activeInput.split('-')[1]);
      query = stops[index];
    }
    
    if (!query || query === 'My Current Location') return false;
    return s.name.toLowerCase().includes(query.toLowerCase()) || 
           s.address.toLowerCase().includes(query.toLowerCase());
  });

  const handleServiceClick = (label: string) => {
    if (label === 'Ride') {
      setScreen('search');
    } else {
      setScreen('coming-soon');
    }
  };

  const toggleFavorite = (place: Place, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const isFavorite = prev.some(f => f.id === place.id);
      if (isFavorite) {
        return prev.filter(f => f.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const selectedPayment = paymentMethods.find(p => p.id === selectedPaymentId) || paymentMethods[0];

  return (
    <div className="min-h-screen bg-uber-gray-50 dark:bg-black flex items-center justify-center p-0 md:p-4">
      {/* Phone Frame for Desktop */}
      <div className={`relative h-screen md:h-[844px] w-full md:w-[390px] md:rounded-[3rem] md:border-[8px] md:border-uber-black dark:md:border-uber-gray-500 overflow-hidden font-sans select-none shadow-2xl transition-colors duration-300 md:ring-1 md:ring-white/10 ${darkMode ? 'dark bg-uber-black text-white' : 'bg-white text-uber-black'}`}>
        {/* Notch for Desktop */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-uber-black dark:bg-uber-gray-500 rounded-b-2xl z-[100]" />
        
        {/* Toast Notifications */}
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-[300px] space-y-2 pointer-events-none px-4">
          <AnimatePresence>
            {toasts.map(toast => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-4 rounded-2xl shadow-xl text-white text-xs font-bold flex items-center gap-3 backdrop-blur-md ${
                  toast.type === 'success' ? 'bg-green-500/90' : 
                  toast.type === 'error' ? 'bg-red-500/90' : 
                  'bg-uber-blue/90'
                }`}
              >
                {toast.type === 'success' && <ShieldCheck size={16} />}
                {toast.type === 'error' && <X size={16} />}
                {toast.type === 'info' && <Zap size={16} />}
                {toast.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/50 z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-4/5 bg-white z-[70] p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-uber-gray-100 dark:bg-uber-gray-500 rounded-full overflow-hidden">
                    <img src="https://picsum.photos/seed/user/200" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div onClick={() => {
                    setScreen('edit-profile');
                    setIsSidebarOpen(false);
                  }} className="cursor-pointer">
                    <p className="font-black text-xl dark:text-white">{userProfile.name}</p>
                    <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200 font-bold">Gold Member</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-10 h-10 bg-uber-gray-50 dark:bg-uber-gray-500 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>

              <nav className="space-y-6 flex-1">
                {[
                  { label: 'My Trips', icon: <History size={20} />, action: () => setScreen('activity') },
                  { label: 'Wallet', icon: <CreditCard size={20} />, action: () => setScreen('wallet') },
                  { label: 'Settings', icon: <Menu size={20} />, action: () => setScreen('settings') },
                  { label: 'Drive with Glide X', icon: <Car size={20} />, action: () => setScreen('driver-signup'), highlight: true },
                  { label: 'Help', icon: <Star size={20} />, action: () => setScreen('coming-soon') },
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center gap-4 w-full text-left p-2 rounded-xl transition-colors ${item.highlight ? 'bg-uber-black dark:bg-white text-white dark:text-uber-black' : 'hover:bg-uber-gray-50 dark:hover:bg-uber-gray-500'}`}
                  >
                    <div className={item.highlight ? 'text-white dark:text-uber-black' : 'text-uber-black dark:text-white'}>{item.icon}</div>
                    <span className="font-bold">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="pt-6 border-t border-uber-gray-100 dark:border-white/10">
                <button 
                  onClick={handleLogout}
                  className="text-red-500 font-black text-sm uppercase tracking-widest flex items-center gap-2"
                >
                  <X size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Login Screen */}
        {screen === 'login' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col p-8 bg-white dark:bg-uber-black relative overflow-hidden"
          >
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-uber-blue/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-uber-blue/5 rounded-full blur-3xl" />

            <div className="flex justify-end z-10">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="w-10 h-10 bg-uber-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full z-10">
              <div className="mb-16 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Logo className="w-64 h-auto mx-auto mb-4" />
                </motion.div>
                <p className="text-uber-gray-400 font-medium tracking-wide uppercase text-[10px]">Premium Ride Hailing</p>
              </div>

              <div className="space-y-6">
                {loginStep === 'phone' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-uber-gray-400 mb-3 ml-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-uber-gray-400 w-5 h-5 group-focus-within:text-uber-blue transition-colors" />
                      <input 
                        type="tel"
                        placeholder="0812 345 6789"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-uber-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-uber-blue/30 rounded-2xl py-5 pl-14 pr-4 font-bold outline-none transition-all dark:text-white placeholder:text-uber-gray-300"
                      />
                    </div>
                  </motion.div>
                )}

                {loginStep === 'otp' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-uber-gray-400 mb-3 ml-1">Verification Code</label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-uber-gray-400 w-5 h-5 group-focus-within:text-uber-blue transition-colors" />
                      <input 
                        type="text"
                        maxLength={4}
                        placeholder="0000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-uber-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-uber-blue/30 rounded-2xl py-5 pl-14 pr-4 font-bold tracking-[1em] text-center outline-none transition-all dark:text-white placeholder:text-uber-gray-300"
                      />
                    </div>
                    <button 
                      onClick={() => setLoginStep('phone')}
                      className="mt-4 text-[10px] font-black text-uber-blue uppercase tracking-widest ml-1"
                    >
                      Change Phone Number
                    </button>
                  </motion.div>
                )}

                {loginStep === 'password' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-uber-gray-400 mb-3 ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-uber-gray-400 w-5 h-5 group-focus-within:text-uber-blue transition-colors" />
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-uber-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-uber-blue/30 rounded-2xl py-5 pl-14 pr-14 font-bold outline-none transition-all dark:text-white placeholder:text-uber-gray-300"
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-uber-gray-400"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4 pt-4">
                  <button 
                    onClick={handleLogin}
                    className="w-full bg-uber-blue hover:bg-uber-blue/90 text-white font-black py-5 rounded-2xl shadow-xl shadow-uber-blue/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                  >
                    <span className="tracking-widest uppercase text-xs">{loginStep === 'password' ? 'Sign In' : 'Continue'}</span>
                    <ArrowRight size={18} />
                  </button>

                  {loginStep === 'phone' && (
                    <button 
                      onClick={() => {
                        showToast('Authenticating with Face ID...', 'info');
                        setTimeout(() => {
                          setIsAuthenticated(true);
                          setScreen('home');
                          showToast('Welcome back!', 'success');
                        }, 1500);
                      }}
                      className="w-full bg-uber-gray-50 dark:bg-white/5 dark:text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-uber-gray-100 dark:hover:bg-white/10 transition-all border border-transparent active:scale-[0.98]"
                    >
                      <ScanFace size={20} className="text-uber-blue" />
                      <span className="tracking-widest uppercase text-xs">Sign in with Face ID</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-16 text-center">
                <p className="text-uber-gray-400 text-xs font-medium mb-4">New to Glide X?</p>
                <button 
                  onClick={() => setScreen('signup')}
                  className="w-full border-2 border-uber-gray-100 dark:border-white/10 dark:text-white font-black py-5 rounded-2xl hover:bg-uber-gray-50 dark:hover:bg-white/5 transition-all active:scale-[0.98]"
                >
                  <span className="tracking-widest uppercase text-xs">Create Account</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Coming Soon Screen */}
        {screen === 'coming-soon' && (
          <motion.div 
            key="coming-soon"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="h-full flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-uber-black"
          >
            <div className="w-24 h-24 bg-uber-blue/10 rounded-full flex items-center justify-center mb-8">
              <Zap size={48} className="text-uber-blue animate-pulse" />
            </div>
            <h2 className="text-2xl font-black mb-4 dark:text-white">Coming Soon</h2>
            <p className="text-uber-gray-500 dark:text-uber-gray-200 mb-12">
              We're working hard to bring this feature to your area. Stay tuned for updates!
            </p>
            <button 
              onClick={() => setScreen('home')}
              className="w-full bg-uber-black dark:bg-white text-white dark:text-uber-black font-black py-4 rounded-2xl"
            >
              Back to Home
            </button>
          </motion.div>
        )}

        {/* Signup Screen */}
        {screen === 'signup' && (
          <motion.div 
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col p-8 bg-white dark:bg-uber-black overflow-y-auto"
          >
            <div className="max-w-sm mx-auto w-full py-8">
              <div className="flex justify-between items-center mb-8">
                <button 
                  onClick={() => setScreen('login')}
                  className="w-10 h-10 flex items-center justify-center bg-uber-gray-50 dark:bg-white/5 rounded-full dark:text-white"
                >
                  <X size={20} />
                </button>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-10 h-10 bg-uber-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>

              <div className="mb-12">
                <Logo className="w-56 h-auto mb-2" />
                <p className="text-uber-gray-500 font-medium">Create your account to start riding.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-uber-gray-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-uber-gray-400 w-5 h-5" />
                    <input 
                      type="text"
                      placeholder="John Doe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-uber-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-uber-blue rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-uber-gray-400 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-uber-gray-400 w-5 h-5" />
                    <input 
                      type="tel"
                      placeholder="0812 345 6789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-uber-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-uber-blue rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-uber-gray-400 mb-2">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-uber-gray-400 w-5 h-5" />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-uber-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-uber-blue rounded-2xl py-4 pl-12 pr-12 font-bold outline-none transition-all dark:text-white"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-uber-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleSignup}
                    className="w-full bg-uber-blue hover:bg-uber-blue/90 text-white font-black py-4 rounded-2xl shadow-xl shadow-uber-blue/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <span>Create Account</span>
                    <UserPlus size={20} />
                  </button>
                </div>

                <p className="text-[10px] text-center text-uber-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  By signing up, you agree to our <span className="text-uber-blue">Terms of Service</span> and <span className="text-uber-blue">Privacy Policy</span>.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Home Screen */}
        {screen === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
          >
            <div className="relative flex-1">
              <MapBackground />

              {/* Drivers Nearby Badge */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-white dark:bg-uber-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-uber-gray-100 dark:border-uber-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-black dark:text-white uppercase tracking-wider">
                    {availableDrivers} drivers nearby
                  </span>
                </div>
              </div>
              
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-10 h-10 bg-white dark:bg-uber-black rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform"
                >
                  <Menu size={20} className="dark:text-white" />
                </button>
                
                <Logo className="w-32 h-auto" />

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setScreen('wallet')}
                    className="bg-white dark:bg-uber-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    <CreditCard size={14} className="text-uber-blue" />
                    <span className="text-xs font-black dark:text-white">₦4,500</span>
                  </button>
                  <button 
                    onClick={() => setIsOnline(!isOnline)}
                    className="bg-white dark:bg-uber-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-xs font-bold dark:text-white">{isOnline ? 'Online' : 'Offline'}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Sheet Content */}
              <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-uber-black rounded-t-[32px] shadow-2xl p-6 z-20">
                <div className="w-10 h-1.5 bg-uber-gray-200 dark:bg-uber-gray-500 rounded-full mx-auto mb-6" />
                
                <div className="flex justify-between items-end mb-6">
                  <h1 className="text-2xl font-black tracking-tight dark:text-white">Where to?</h1>
                  <button 
                    onClick={() => setScreen('driver-signup')}
                    className="text-[10px] font-black uppercase tracking-wider text-uber-blue bg-uber-blue/10 px-3 py-1 rounded-full"
                  >
                    Drive & Earn
                  </button>
                </div>
                
                {/* Search Bar */}
                <div 
                  onClick={handleSearchFocus}
                  className="bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl flex items-center gap-4 cursor-pointer mb-6 border border-transparent hover:border-uber-gray-200 transition-colors"
                >
                  <Search size={20} className="text-uber-black dark:text-white" />
                  <span className="text-uber-gray-500 dark:text-uber-gray-200 font-medium">Search destination</span>
                  <div className="ml-auto flex items-center gap-2 bg-white dark:bg-uber-black px-3 py-1 rounded-full shadow-sm">
                    <Clock size={14} className="dark:text-white" />
                    <span className="text-xs font-bold dark:text-white">Now</span>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-4 mb-8">
                  <div onClick={() => handlePlaceSelect(RECENT_PLACES[1])} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-10 h-10 bg-uber-gray-100 dark:bg-uber-gray-500 rounded-full flex items-center justify-center group-hover:bg-uber-gray-200 transition-colors">
                      <Home size={18} className="dark:text-white" />
                    </div>
                    <div className="flex-1 border-b border-uber-gray-100 dark:border-uber-gray-500 pb-4">
                      <p className="font-bold dark:text-white">Home</p>
                      <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">Add home</p>
                    </div>
                  </div>
                  <div onClick={() => handlePlaceSelect(RECENT_PLACES[2])} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-10 h-10 bg-uber-gray-100 dark:bg-uber-gray-500 rounded-full flex items-center justify-center group-hover:bg-uber-gray-200 transition-colors">
                      <Briefcase size={18} className="dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold dark:text-white">Work</p>
                      <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">Add work</p>
                    </div>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div 
                    onClick={() => setScreen('search')}
                    className="bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-2xl flex flex-col items-center gap-3 cursor-pointer hover:bg-uber-gray-100 dark:hover:bg-uber-gray-400 transition-all active:scale-95 shadow-sm"
                  >
                    <div className="w-12 h-12 bg-white dark:bg-uber-black rounded-full flex items-center justify-center shadow-md">
                      <Car size={24} className="dark:text-white" />
                    </div>
                    <span className="font-bold text-sm dark:text-white">Ride</span>
                  </div>
                  <div 
                    onClick={() => setScreen('food')}
                    className="bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-2xl flex flex-col items-center gap-3 cursor-pointer hover:bg-uber-gray-100 dark:hover:bg-uber-gray-400 transition-all active:scale-95 shadow-sm"
                  >
                    <div className="w-12 h-12 bg-white dark:bg-uber-black rounded-full flex items-center justify-center shadow-md">
                      <Package size={24} className="dark:text-white" />
                    </div>
                    <span className="font-bold text-sm dark:text-white">Food</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Package', icon: <Package size={18} /> },
                    { label: 'Reserve', icon: <Calendar size={18} />, action: () => setScreen('reserve') },
                    { label: 'Rent', icon: <CreditCard size={18} /> },
                    { label: 'Moto', icon: <Car size={18} /> },
                  ].map((s) => (
                    <div 
                      key={s.label} 
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                      onClick={() => s.action ? s.action() : setScreen('coming-soon')}
                    >
                      <div className="w-full aspect-square rounded-2xl bg-uber-gray-50 dark:bg-uber-gray-500 flex items-center justify-center transition-all group-active:scale-95">
                        <div className="dark:text-white">{s.icon}</div>
                      </div>
                      <span className="text-[10px] font-bold dark:text-white">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Promo Banner */}
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setScreen('driver-signup')}
                  className="bg-uber-black dark:bg-white text-white dark:text-uber-black p-4 rounded-2xl flex items-center justify-between cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="font-black text-sm mb-1">Drive with Glide X</p>
                    <p className="text-[10px] text-uber-gray-300 dark:text-uber-gray-500">Earn up to ₦150,000/week</p>
                  </div>
                  <div className="w-10 h-10 bg-white/10 dark:bg-uber-black/10 rounded-full flex items-center justify-center">
                    <ArrowRight size={18} />
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="h-20" /> {/* Spacer for bottom nav */}
          </motion.div>
        )}

        {/* Search Screen */}
        {screen === 'search' && (
          <motion.div 
            key="search"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-white/95 dark:bg-uber-black/95 backdrop-blur-md z-40 flex flex-col"
          >
            <div className="p-6 border-b border-uber-gray-100 dark:border-uber-gray-500">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setScreen('home')} className="p-2 -ml-2">
                  <X size={24} className="dark:text-white" />
                </button>
                <h2 className="text-xl font-bold dark:text-white">Plan your ride</h2>
              </div>
              
                <div className="space-y-3">
                  <div className={`flex items-center gap-4 p-3 rounded-lg transition-all ${activeInput === 'pickup' ? 'bg-uber-gray-100 dark:bg-uber-gray-400 ring-2 ring-uber-black/5' : 'bg-uber-gray-50 dark:bg-uber-gray-500'}`}>
                    <div className="w-2 h-2 bg-uber-gray-500 dark:bg-uber-gray-200 rounded-full" />
                    <input 
                      type="text" 
                      placeholder="Current location" 
                      className="bg-transparent flex-1 outline-none text-sm font-medium dark:text-white"
                      value={pickupQuery}
                      onFocus={() => setActiveInput('pickup')}
                      onChange={(e) => setPickupQuery(e.target.value)}
                    />
                  </div>

                  {stops.map((stop, index) => (
                    <div key={index} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${activeInput === `stop-${index}` ? 'bg-uber-gray-100 dark:bg-uber-gray-400 ring-2 ring-uber-black/5' : 'bg-uber-gray-50 dark:bg-uber-gray-500'}`}>
                      <div className="w-2 h-2 border border-uber-gray-500 dark:border-uber-gray-200 rounded-full" />
                      <input 
                        type="text" 
                        placeholder="Add a stop" 
                        className="bg-transparent flex-1 outline-none text-sm font-medium dark:text-white"
                        value={stop}
                        onFocus={() => setActiveInput(`stop-${index}` as any)}
                        onChange={(e) => {
                          const newStops = [...stops];
                          newStops[index] = e.target.value;
                          setStops(newStops);
                        }}
                      />
                      <button onClick={() => setStops(stops.filter((_, i) => i !== index))} className="text-uber-gray-400">
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  <div className={`flex items-center gap-4 p-3 rounded-lg transition-all ${activeInput === 'destination' ? 'bg-uber-gray-100 dark:bg-uber-gray-400 ring-2 ring-uber-black/5' : 'bg-uber-gray-50 dark:bg-uber-gray-500'}`}>
                    <div className="w-2 h-2 bg-uber-black dark:bg-white rounded-sm" />
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Where to?" 
                      value={searchQuery}
                      onFocus={() => setActiveInput('destination')}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent flex-1 outline-none text-sm font-bold dark:text-white"
                    />
                    {stops.length < 2 && (
                      <button 
                        onClick={() => setStops([...stops, ''])}
                        className="w-8 h-8 bg-uber-gray-100 dark:bg-uber-gray-400 rounded-full flex items-center justify-center"
                      >
                        <span className="text-lg font-bold dark:text-white">+</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 dark:bg-uber-black">
                {filteredSuggestions.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-uber-blue uppercase tracking-wider mb-4">Suggestions</h3>
                    <div className="space-y-4">
                      {filteredSuggestions.map((place) => (
                        <div 
                          key={`suggest-${place.id}`} 
                          onClick={() => handlePlaceSelect(place)}
                          className="flex items-center gap-4 cursor-pointer group"
                        >
                          <div className="w-10 h-10 bg-uber-blue/10 text-uber-blue rounded-full flex items-center justify-center">
                            {place.icon}
                          </div>
                          <div className="flex-1 border-b border-uber-gray-50 dark:border-uber-gray-500 pb-4">
                            <p className="font-bold text-sm dark:text-white">{place.name}</p>
                            <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">{place.address}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {favorites.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase tracking-wider mb-4">Favorites</h3>
                    <div className="space-y-4">
                      {favorites.map((place) => (
                        <div 
                          key={`fav-${place.id}`} 
                          onClick={() => handlePlaceSelect(place)}
                          className="flex items-center gap-4 cursor-pointer group"
                        >
                          <div className="w-10 h-10 bg-uber-black dark:bg-white text-white dark:text-uber-black rounded-full flex items-center justify-center">
                            <Star size={18} className="fill-current" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm dark:text-white">{place.name}</p>
                            <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">{place.address}</p>
                          </div>
                          <button 
                            onClick={(e) => toggleFavorite(place, e)}
                            className="p-2 text-uber-black dark:text-white"
                          >
                            <Star size={18} className="fill-current" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase tracking-wider mb-4">Recent</h3>
                  <div className="space-y-4">
                    {RECENT_PLACES.map((place) => {
                      const isFavorite = favorites.some(f => f.id === place.id);
                      return (
                        <div 
                          key={place.id} 
                          onClick={() => handlePlaceSelect(place)}
                          className="flex items-center gap-4 cursor-pointer group"
                        >
                          <div className="w-10 h-10 bg-uber-gray-50 dark:bg-uber-gray-500 rounded-full flex items-center justify-center group-hover:bg-uber-gray-100 dark:group-hover:bg-uber-gray-400">
                            <div className="dark:text-white">{place.icon}</div>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm dark:text-white">{place.name}</p>
                            <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">{place.address}</p>
                          </div>
                          <button 
                            onClick={(e) => toggleFavorite(place, e)}
                            className={`p-2 transition-colors ${isFavorite ? 'text-uber-black dark:text-white' : 'text-uber-gray-300 dark:text-uber-gray-400 hover:text-uber-gray-500'}`}
                          >
                            <Star size={18} className={isFavorite ? 'fill-current' : ''} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              
              <button 
                onClick={() => showToast('Map selection is coming soon!', 'info')}
                className="flex items-center gap-4 text-uber-blue font-bold text-sm w-full text-left"
              >
                <div className="w-10 h-10 bg-uber-blue/10 rounded-full flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                Set location on map
              </button>
            </div>
          </motion.div>
        )}

        {/* Ride Options Screen */}
        {screen === 'ride-options' && (
          <motion.div 
            key="ride-options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
          >
            <div className="relative flex-1">
              <MapBackground />
              
              {/* Drivers Nearby Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 z-10"
              >
                <div className="bg-white dark:bg-uber-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-uber-gray-100 dark:border-uber-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-black dark:text-white uppercase tracking-wider">
                    {availableDrivers} drivers nearby
                  </span>
                </div>
              </motion.div>

              {/* Back Button */}
              <div className="absolute top-0 left-0 p-6 z-10">
                <button 
                  onClick={() => setScreen('home')}
                  className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Ride Selection Sheet */}
              <motion.div 
                initial={{ y: '60%' }}
                animate={{ y: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-uber-black rounded-t-[32px] shadow-2xl flex flex-col max-h-[70%] z-20"
              >
                <div className="w-10 h-1.5 bg-uber-gray-200 dark:bg-uber-gray-500 rounded-full mx-auto my-4 flex-shrink-0" />
                
                <div className="px-6 pb-4 border-b border-uber-gray-100 dark:border-uber-gray-500">
                  <h2 className="text-lg font-bold dark:text-white">Choose a ride</h2>
                </div>

                <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 hide-scrollbar">
                  {RIDE_OPTIONS.map((ride) => (
                    <div 
                      key={ride.id}
                      onClick={() => setSelectedRide(ride)}
                      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${selectedRide?.id === ride.id ? 'bg-uber-gray-50 dark:bg-uber-gray-500 ring-2 ring-uber-black dark:ring-white' : 'hover:bg-uber-gray-50 dark:hover:bg-uber-gray-500'}`}
                    >
                      <div className="w-14 h-14 bg-white dark:bg-uber-gray-400 rounded-xl shadow-sm flex items-center justify-center border border-uber-gray-100 dark:border-uber-gray-500">
                        <div className="dark:text-white">{ride.icon}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className="font-bold dark:text-white">{ride.name}</p>
                          <p className="font-black text-lg dark:text-white">₦{ride.price.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">{ride.eta} away</p>
                          {ride.surge && (
                            <div className="flex items-center gap-1 bg-uber-blue/10 px-2 py-0.5 rounded-full">
                              <Zap size={10} className="text-uber-blue fill-uber-blue" />
                              <span className="text-[10px] font-black text-uber-blue uppercase tracking-wider">Surge</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-white dark:bg-uber-black border-t border-uber-gray-100 dark:border-uber-gray-500">
                  <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
                    <button 
                      onClick={() => setScreen('reserve')}
                      className="flex items-center gap-2 bg-uber-gray-50 dark:bg-uber-gray-500 px-4 py-2 rounded-full whitespace-nowrap active:scale-95 transition-transform"
                    >
                      <Calendar size={16} className="dark:text-white" />
                      <span className="text-xs font-bold dark:text-white">Reserve</span>
                    </button>
                    <div className="flex items-center gap-2 bg-uber-gray-50 dark:bg-uber-gray-500 px-4 py-2 rounded-full whitespace-nowrap">
                      <Package size={16} className="dark:text-white" />
                      <span className="text-xs font-bold dark:text-white">For someone else</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex-1 bg-uber-gray-50 dark:bg-uber-gray-500 p-3 rounded-xl flex items-center gap-2">
                      <Star size={16} className="text-uber-blue" />
                      <input 
                        type="text" 
                        placeholder="Promo code" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="bg-transparent flex-1 outline-none text-xs font-bold dark:text-white"
                      />
                      {promoCode && (
                        <button 
                          onClick={() => setIsPromoApplied(!isPromoApplied)}
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded ${isPromoApplied ? 'bg-green-500 text-white' : 'bg-uber-black text-white dark:bg-white dark:text-uber-black'}`}
                        >
                          {isPromoApplied ? 'Applied' : 'Apply'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div 
                    onClick={() => setScreen('payment-selection')}
                    className="flex items-center justify-between mb-6 cursor-pointer group active:bg-uber-gray-50 dark:active:bg-uber-gray-500 p-2 -mx-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {selectedPayment.type === 'card' ? (
                        <div className="bg-uber-black dark:bg-white text-white dark:text-uber-black px-2 py-0.5 rounded text-[10px] font-black">{selectedPayment.brand}</div>
                      ) : (
                        <div className="w-8 h-8 bg-uber-gray-100 dark:bg-uber-gray-500 rounded-full flex items-center justify-center">
                          <div className="dark:text-white">
                            {selectedPayment.type === 'cash' ? <CreditCard size={16} /> : <Star size={16} />}
                          </div>
                        </div>
                      )}
                      <span className="text-sm font-bold dark:text-white">
                        {selectedPayment.type === 'card' ? `•••• ${selectedPayment.last4}` : selectedPayment.label}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-uber-gray-500 dark:text-uber-gray-200 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <button 
                    onClick={() => {
                      setScreen('ride-tracking');
                    }}
                    className="w-full bg-uber-black dark:bg-white text-white dark:text-uber-black py-4 rounded-xl font-black text-lg shadow-xl active:scale-[0.98] transition-transform"
                  >
                    Confirm {selectedRide?.name}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Ride Tracking Screen */}
        {screen === 'ride-tracking' && (
          <motion.div 
            key="ride-tracking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
          >
            <div className="relative flex-1">
              <MapBackground />
              
              {/* Driver Icon on Map */}
              {!isFetchingDriver && (
                <motion.div 
                  animate={{ 
                    x: driverPos.x * 5, 
                    y: driverPos.y * 5 
                  }}
                  className="absolute top-1/3 left-1/4 z-10 text-3xl drop-shadow-lg"
                >
                  🚕
                </motion.div>
              )}

              {/* Loading Indicator for Driver Location */}
              <AnimatePresence>
                {isFetchingDriver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 bg-white/60 dark:bg-uber-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="relative w-24 h-24 mb-6">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-uber-blue rounded-full"
                      />
                      <div className="absolute inset-4 bg-white dark:bg-uber-black rounded-full flex items-center justify-center shadow-lg">
                        <RefreshCw size={32} className="text-uber-blue animate-spin" />
                      </div>
                    </div>
                    <h3 className="text-lg font-black dark:text-white mb-2">Connecting to Driver</h3>
                    <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200 font-medium">Fetching real-time location data...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Destination Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-4 h-4 bg-uber-black rounded-full border-2 border-white shadow-lg" />
              </div>

              {/* Header Info */}
              <div className="absolute top-0 left-0 right-0 p-6 z-10">
                <div className="bg-white dark:bg-uber-black p-4 rounded-2xl shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <Navigation size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Arriving in</p>
                      <p className="text-lg font-black dark:text-white">4 mins</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setScreen('home')}
                    className="w-10 h-10 bg-uber-gray-100 dark:bg-uber-gray-500 rounded-full flex items-center justify-center"
                  >
                    <X size={20} className="dark:text-white" />
                  </button>
                </div>
              </div>

              {/* Driver Details Sheet */}
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-uber-black rounded-t-[32px] shadow-2xl p-6 z-20"
              >
                <div className="w-10 h-1.5 bg-uber-gray-200 dark:bg-uber-gray-500 rounded-full mx-auto mb-6" />
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-uber-gray-100 dark:bg-uber-gray-500 rounded-full overflow-hidden border-2 border-white dark:border-uber-gray-400 shadow-md">
                        <img src="https://picsum.photos/seed/driver/200" alt="Driver" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-uber-black px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-uber-gray-100 dark:border-uber-gray-500">
                        <span className="text-[10px] font-black dark:text-white">4.9</span>
                        <Star size={8} className="fill-uber-black dark:fill-white dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-xl dark:text-white">Chinedu</p>
                      <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200 font-bold uppercase tracking-wider">Silver Toyota Corolla • ABC-123-XY</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 bg-uber-gray-50 dark:bg-uber-gray-500 rounded-full flex items-center justify-center mb-1 ml-auto">
                      <Car size={24} className="dark:text-white" />
                    </div>
                    <p className="text-[10px] font-black text-uber-gray-400 dark:text-uber-gray-200 uppercase">Glide X</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-8">
                  <button 
                    onClick={() => setIsSafetyModalOpen(true)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-uber-gray-50 dark:bg-uber-gray-500 active:scale-95 transition-transform"
                  >
                    <div className="w-10 h-10 bg-white dark:bg-uber-black rounded-full flex items-center justify-center shadow-sm">
                      <Navigation size={20} className="dark:text-white" />
                    </div>
                    <span className="text-[10px] font-bold dark:text-white">Safety</span>
                  </button>
                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-uber-gray-50 dark:bg-uber-gray-500 active:scale-95 transition-transform"
                  >
                    <div className="w-10 h-10 bg-white dark:bg-uber-black rounded-full flex items-center justify-center shadow-sm">
                      <Share2 size={20} className="dark:text-white" />
                    </div>
                    <span className="text-[10px] font-bold dark:text-white">Share</span>
                  </button>
                  <button 
                    onClick={() => setIsMessageModalOpen(true)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-uber-gray-50 dark:bg-uber-gray-500 active:scale-95 transition-transform"
                  >
                    <div className="w-10 h-10 bg-white dark:bg-uber-black rounded-full flex items-center justify-center shadow-sm">
                      <User size={20} className="dark:text-white" />
                    </div>
                    <span className="text-[10px] font-bold dark:text-white">Contact</span>
                  </button>
                  <button 
                    onClick={() => setIsCancelModalOpen(true)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 active:scale-95 transition-transform"
                  >
                    <div className="w-10 h-10 bg-white dark:bg-uber-black rounded-full flex items-center justify-center shadow-sm">
                      <X size={20} />
                    </div>
                    <span className="text-[10px] font-bold">Cancel</span>
                  </button>
                </div>

                <button 
                  onClick={() => setScreen('rating')}
                  className="w-full bg-uber-blue text-white py-3 rounded-xl font-bold text-sm mb-4 active:scale-95 transition-transform"
                >
                  Simulate Ride End
                </button>

                <div className="bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white dark:bg-uber-black rounded-full flex items-center justify-center shadow-sm">
                      <CreditCard size={16} className="dark:text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold dark:text-white">Payment</p>
                      <p className="text-[10px] text-uber-gray-500 dark:text-uber-gray-200 font-bold uppercase tracking-tight">
                        {selectedPayment.type === 'card' ? `•••• ${selectedPayment.last4}` : selectedPayment.label}
                      </p>
                    </div>
                  </div>
                  <p className="font-black dark:text-white">₦{selectedRide?.price.toLocaleString()}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Payment Selection Screen */}
        {screen === 'payment-selection' && (
          <motion.div 
            key="payment-selection"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-0 bg-white dark:bg-uber-black z-50 flex flex-col"
          >
            <div className="p-6 border-b border-uber-gray-100 dark:border-uber-gray-500 flex items-center gap-4">
              <button onClick={() => setScreen('ride-options')} className="p-2 -ml-2">
                <X size={24} className="dark:text-white" />
              </button>
              <h2 className="text-xl font-black dark:text-white">Payment methods</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => {
                      setSelectedPaymentId(method.id);
                      setScreen('ride-options');
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${selectedPaymentId === method.id ? 'bg-uber-gray-50 dark:bg-uber-gray-500 ring-2 ring-uber-black dark:ring-white' : 'hover:bg-uber-gray-50 dark:hover:bg-uber-gray-500'}`}
                  >
                    <div className="w-10 h-10 bg-white dark:bg-uber-gray-400 rounded-xl shadow-sm flex items-center justify-center border border-uber-gray-100 dark:border-uber-gray-500">
                      <div className="dark:text-uber-black">
                        {method.type === 'card' ? (
                          <span className="text-[10px] font-black">{method.brand}</span>
                        ) : method.type === 'cash' ? (
                          <CreditCard size={20} />
                        ) : (
                          <Star size={20} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm dark:text-white">
                        {method.type === 'card' ? `•••• ${method.last4}` : method.label}
                      </p>
                      {method.type === 'card' && <p className="text-[10px] text-uber-gray-500 dark:text-uber-gray-200 font-bold uppercase">{method.label}</p>}
                    </div>
                    {selectedPaymentId === method.id && (
                      <div className="w-5 h-5 bg-uber-black dark:bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white dark:bg-uber-black rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setScreen('add-payment')}
                className="flex items-center gap-4 text-uber-blue font-bold text-sm w-full p-4 rounded-2xl hover:bg-uber-blue/5 transition-colors"
              >
                <div className="w-10 h-10 bg-uber-blue/10 rounded-full flex items-center justify-center">
                  <ArrowRight size={18} />
                </div>
                Add payment method
              </button>
            </div>
          </motion.div>
        )}

        {/* Add Payment Screen */}
        {screen === 'add-payment' && (
          <motion.div 
            key="add-payment"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute inset-0 bg-white dark:bg-uber-black z-[60] flex flex-col"
          >
            <div className="p-6 border-b border-uber-gray-100 dark:border-uber-gray-500 flex items-center gap-4">
              <button onClick={() => setScreen('payment-selection')} className="p-2 -ml-2">
                <X size={24} className="dark:text-white" />
              </button>
              <h2 className="text-xl font-black dark:text-white">Add card</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Card Number</label>
                  <div className="flex items-center gap-3 bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400">
                    <CreditCard size={20} className="text-uber-gray-400 dark:text-uber-gray-200" />
                    <input type="text" placeholder="0000 0000 0000 0000" className="bg-transparent flex-1 outline-none font-bold dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">CVV</label>
                    <input type="text" placeholder="123" className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none dark:text-white" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  const newCard: PaymentMethod = {
                    id: Date.now().toString(),
                    type: 'card',
                    label: 'New Card',
                    last4: '1234',
                    brand: 'MASTERCARD'
                  };
                  setPaymentMethods([...paymentMethods, newCard]);
                  setSelectedPaymentId(newCard.id);
                  setScreen('ride-options');
                }}
                className="w-full bg-uber-black dark:bg-white text-white dark:text-uber-black py-4 rounded-xl font-black text-lg shadow-xl active:scale-[0.98] transition-transform mt-auto"
              >
                Save card
              </button>
            </div>
          </motion.div>
        )}

        {/* Activity Screen */}
        {screen === 'activity' && (
          <motion.div 
            key="activity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full bg-white dark:bg-uber-black p-6 flex flex-col"
          >
            <h1 className="text-3xl font-black mb-8 pt-8 dark:text-white">Activity</h1>
            
            <div className="flex-1 space-y-8 overflow-y-auto hide-scrollbar">
              <div>
                <h3 className="text-lg font-bold mb-4 dark:text-white">Past</h3>
                <div className="space-y-6">
                  {trips.map((trip) => (
                    <div 
                      key={trip.id} 
                      onClick={() => {
                        setSelectedTrip(trip);
                        setScreen('trip-details');
                      }}
                      className="flex gap-4 group cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-uber-gray-50 dark:bg-uber-gray-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-uber-gray-100 dark:group-hover:bg-uber-gray-400">
                        <Car size={20} className="dark:text-white" />
                      </div>
                      <div className="flex-1 border-b border-uber-gray-100 dark:border-uber-gray-500 pb-6">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-sm leading-tight dark:text-white">{trip.destination}</p>
                          <p className="font-bold text-sm dark:text-white">{trip.price}</p>
                        </div>
                        <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200 mb-2">{trip.date}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${trip.isCancelled ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                            {trip.status}
                          </span>
                          {trip.rating && (
                            <div className="flex items-center gap-1">
                              <Star size={10} className="fill-uber-black dark:fill-white dark:text-white" />
                              <span className="text-[10px] font-bold dark:text-white">{trip.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-20" />
          </motion.div>
        )}

        {/* Trip Details Screen */}
        {screen === 'trip-details' && selectedTrip && (
          <motion.div 
            key="trip-details"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute inset-0 bg-white dark:bg-uber-black z-50 flex flex-col"
          >
            <div className="p-6 pt-14 border-b border-uber-gray-100 dark:border-uber-gray-500 flex items-center gap-4">
              <button onClick={() => setScreen('activity')} className="p-2 -ml-2">
                <X size={24} className="dark:text-white" />
              </button>
              <h2 className="text-xl font-black dark:text-white">Trip Details</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="h-48 bg-uber-gray-100 dark:bg-uber-gray-500 relative">
                <MapBackground />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <div className="p-6 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black dark:text-white">{selectedTrip.destination}</h3>
                    <p className="text-sm text-uber-gray-500 dark:text-uber-gray-200">{selectedTrip.date}</p>
                  </div>
                  <p className="text-2xl font-black dark:text-white">{selectedTrip.price}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-uber-gray-400 rounded-full" />
                    <p className="text-sm font-medium dark:text-white">{selectedTrip.pickup}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-uber-black dark:bg-white rounded-sm" />
                    <p className="text-sm font-bold dark:text-white">{selectedTrip.destination}</p>
                  </div>
                </div>

                {selectedTrip.driverName && (
                  <div className="pt-6 border-t border-uber-gray-100 dark:border-uber-gray-500">
                    <p className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase mb-4">Driver</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-uber-gray-100 rounded-full overflow-hidden">
                          <img src={`https://picsum.photos/seed/${selectedTrip.driverName}/200`} alt="Driver" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold dark:text-white">{selectedTrip.driverName}</p>
                          <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">
                            {selectedTrip.carColor} {selectedTrip.carModel}
                          </p>
                        </div>
                      </div>
                      {selectedTrip.rating && (
                        <div className="flex items-center gap-1 bg-uber-gray-50 dark:bg-uber-gray-500 px-3 py-1 rounded-full">
                          <Star size={14} className="fill-uber-black dark:fill-white dark:text-white" />
                          <span className="text-sm font-bold dark:text-white">{selectedTrip.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-uber-gray-100 dark:border-uber-gray-500 space-y-4">
                  <button className="w-full py-4 rounded-xl border border-uber-gray-200 dark:border-uber-gray-400 font-bold dark:text-white">Receipt</button>
                  <button className="w-full py-4 rounded-xl border border-uber-gray-200 dark:border-uber-gray-400 font-bold text-red-600">Report an issue</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rating Screen */}
        {screen === 'rating' && (
          <motion.div 
            key="rating"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-0 bg-white dark:bg-uber-black z-50 flex flex-col p-6"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-uber-gray-100 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl">
                <img src="https://picsum.photos/seed/driver/200" alt="Driver" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-black mb-2 dark:text-white">How was your ride with Chinedu?</h2>
              <p className="text-uber-gray-500 dark:text-uber-gray-200 mb-10">Your feedback helps us improve the Glide X experience.</p>
              
              <div className="flex gap-2 mb-12">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRideRating(star)}
                    className="p-2"
                  >
                    <Star 
                      size={40} 
                      className={`${rideRating >= star ? 'fill-uber-black dark:fill-white text-uber-black dark:text-white' : 'text-uber-gray-200 dark:text-uber-gray-500'}`} 
                    />
                  </button>
                ))}
              </div>

              <div className="w-full space-y-3">
                <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-4">Add a tip for Chinedu</p>
                <div className="flex gap-3">
                  {['₦200', '₦500', '₦1,000', 'Other'].map((tip) => (
                    <button key={tip} className="flex-1 py-3 rounded-xl bg-uber-gray-50 dark:bg-uber-gray-500 font-bold text-sm dark:text-white active:scale-95 transition-transform">
                      {tip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                const newTrip: Trip = {
                  id: Date.now().toString(),
                  date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
                  destination: searchQuery || 'Lekki Phase 1',
                  pickup: pickupQuery || 'Current Location',
                  price: selectedRide ? `₦${selectedRide.price.toLocaleString()}` : '₦2,400',
                  status: 'Completed',
                  driverName: 'Chinedu',
                  carModel: 'Toyota Corolla',
                  carColor: 'Silver',
                  rating: rideRating || 5
                };
                setTrips([newTrip, ...trips]);
                setScreen('home');
                setRideRating(0);
              }}
              className="w-full bg-uber-black dark:bg-white text-white dark:text-uber-black py-4 rounded-xl font-black text-lg shadow-xl active:scale-[0.98] transition-transform"
            >
              Done
            </button>
          </motion.div>
        )}

        {/* Edit Profile Screen */}
        {screen === 'edit-profile' && (
          <motion.div 
            key="edit-profile"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute inset-0 bg-white dark:bg-uber-black z-50 flex flex-col"
          >
            <div className="p-6 pt-14 border-b border-uber-gray-100 dark:border-uber-gray-500 flex items-center gap-4">
              <button onClick={() => setScreen('account')} className="p-2 -ml-2">
                <X size={24} className="dark:text-white" />
              </button>
              <h2 className="text-xl font-black dark:text-white">Edit Profile</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-uber-gray-100 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img src="https://picsum.photos/seed/user/200" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-uber-black rounded-full shadow-md flex items-center justify-center border border-uber-gray-100 dark:border-uber-gray-500">
                    <Camera size={16} className="dark:text-white" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none dark:text-white font-bold" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none dark:text-white font-bold" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Email</label>
                  <input 
                    type="email" 
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none dark:text-white font-bold" 
                  />
                </div>
              </div>

              <button 
                onClick={() => setScreen('account')}
                className="w-full bg-uber-black dark:bg-white text-white dark:text-uber-black py-4 rounded-xl font-black text-lg shadow-xl active:scale-[0.98] transition-transform mt-8"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {/* Reserve Screen */}
        {screen === 'reserve' && (
          <motion.div 
            key="reserve"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-0 bg-white dark:bg-uber-black z-50 flex flex-col"
          >
            <div className="p-6 pt-14 border-b border-uber-gray-100 dark:border-uber-gray-500 flex items-center gap-4">
              <button onClick={() => setScreen('ride-options')} className="p-2 -ml-2">
                <X size={24} className="dark:text-white" />
              </button>
              <h2 className="text-xl font-black dark:text-white">Reserve a ride</h2>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-10">
                <div className="w-16 h-16 bg-uber-blue/10 text-uber-blue rounded-full flex items-center justify-center mb-6">
                  <Calendar size={32} />
                </div>
                <h3 className="text-2xl font-black mb-2 dark:text-white">Choose when you'd like to be picked up</h3>
                <p className="text-uber-gray-500 dark:text-uber-gray-200 text-sm">Select a time at least 30 minutes in advance. We'll find a driver for you.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Date</label>
                  <input 
                    type="date" 
                    value={reserveDate}
                    onChange={(e) => setReserveDate(e.target.value)}
                    className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none dark:text-white font-bold" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Time</label>
                  <input 
                    type="time" 
                    value={reserveTime}
                    onChange={(e) => setReserveTime(e.target.value)}
                    className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none dark:text-white font-bold" 
                  />
                </div>
              </div>

              <div className="mt-auto pt-10">
                <div className="bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-2xl mb-6">
                  <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200 font-medium leading-relaxed">
                    Reserve fee may apply. You can cancel at no charge up to 60 minutes before your pickup time.
                  </p>
                </div>
                <button 
                  disabled={!reserveDate || !reserveTime}
                  onClick={() => {
                    showToast(`Ride reserved for ${reserveDate} at ${reserveTime}`, 'success');
                    setScreen('home');
                  }}
                  className="w-full bg-uber-black dark:bg-white text-white dark:text-uber-black py-4 rounded-xl font-black text-lg shadow-xl active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  Reserve Glide X
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Account Screen */}
        {screen === 'account' && (
          <motion.div 
            key="account"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full bg-white dark:bg-uber-black flex flex-col"
          >
            <div className="p-6 pt-14">
              <div className="flex justify-between items-center mb-10">
                <div onClick={() => setScreen('edit-profile')} className="cursor-pointer">
                  <h1 className="text-3xl font-black mb-1 dark:text-white">{userProfile.name}</h1>
                  <div className="flex items-center gap-2 bg-uber-gray-50 dark:bg-uber-gray-500 px-3 py-1 rounded-full w-fit">
                    <Star size={12} className="fill-uber-black dark:fill-white dark:text-white" />
                    <span className="text-xs font-bold dark:text-white">4.92 Rating</span>
                  </div>
                </div>
                <div onClick={() => setScreen('edit-profile')} className="w-20 h-20 bg-uber-gray-100 dark:bg-uber-gray-500 rounded-full overflow-hidden border-4 border-white dark:border-uber-gray-400 shadow-lg cursor-pointer">
                  <img src="https://picsum.photos/seed/user/200" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>

              {/* Glide X One Banner */}
              <div className="bg-gradient-to-r from-uber-blue to-blue-600 p-6 rounded-2xl mb-10 text-white shadow-lg relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white text-uber-blue px-2 py-0.5 rounded text-[10px] font-black uppercase">Glide X One</div>
                  </div>
                  <h3 className="text-xl font-black mb-1">Save on every ride</h3>
                  <p className="text-xs text-white/80 font-medium">₦0 delivery fees and 5% off eligible Glide X rides.</p>
                </div>
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { label: 'Help', icon: <Star size={20} />, action: () => setScreen('coming-soon') },
                  { label: 'Wallet', icon: <CreditCard size={20} />, action: () => setScreen('wallet') },
                  { label: 'Activity', icon: <History size={20} />, action: () => setScreen('activity') },
                ].map((item) => (
                  <div 
                    key={item.label} 
                    onClick={item.action}
                    className="bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-2xl flex flex-col items-center gap-2 cursor-pointer hover:bg-uber-gray-100 dark:hover:bg-uber-gray-400 transition-colors active:scale-95"
                  >
                    <div className="dark:text-white">{item.icon}</div>
                    <span className="text-xs font-bold dark:text-white">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                {[
                  { label: 'Messages', icon: <Search size={18} />, action: () => showToast('No new messages', 'info') },
                  { label: 'Send a gift', icon: <Package size={18} />, action: () => showToast('Gift cards coming soon', 'info') },
                  { label: 'Refer a friend', icon: <User size={18} />, action: () => setScreen('referrals') },
                  { label: 'Settings', icon: <Menu size={18} />, action: () => setScreen('settings') },
                  { label: 'Legal', icon: <Search size={18} />, action: () => showToast('Terms of Service & Privacy Policy', 'info') },
                ].map((item) => (
                  <div 
                    key={item.label} 
                    onClick={item.action}
                    className="flex items-center justify-between py-4 border-b border-uber-gray-50 dark:border-uber-gray-500 cursor-pointer group active:bg-uber-gray-50 dark:active:bg-uber-gray-500 px-2 -mx-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-uber-gray-500 dark:text-uber-gray-200 group-hover:text-uber-black dark:group-hover:text-white transition-colors">{item.icon}</div>
                      <span className="font-bold dark:text-white">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-uber-gray-200 dark:text-uber-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto p-6 mb-20 space-y-4">
              <button 
                onClick={handleLogout}
                className="w-full py-4 rounded-xl border-2 border-red-100 dark:border-red-900/30 text-red-500 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <X size={18} />
                <span>Sign Out</span>
              </button>
              <p className="text-[10px] text-uber-gray-500 dark:text-uber-gray-200 font-bold uppercase tracking-widest text-center">Glide X v4.432.10003</p>
            </div>
          </motion.div>
        )}

        {/* Food (Uber Eats) Screen */}
        {screen === 'food' && (
          <motion.div 
            key="food"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full bg-white dark:bg-uber-black flex flex-col"
          >
            <div className="p-6 pt-14 border-b border-uber-gray-100 dark:border-uber-gray-500 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setScreen('home')} className="p-2 -ml-2">
                  <X size={24} className="dark:text-white" />
                </button>
                <h2 className="text-xl font-black dark:text-white">Glide X Food</h2>
              </div>
              <div className="flex items-center gap-2 bg-uber-gray-50 dark:bg-uber-gray-500 px-3 py-1.5 rounded-full">
                <Search size={16} className="dark:text-white" />
                <span className="text-xs font-bold dark:text-white">Search</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {['All', 'Deals', 'Grocery', 'Alcohol', 'Convenience', 'Fast Food'].map((cat) => (
                  <button key={cat} className="px-4 py-2 bg-uber-gray-50 dark:bg-uber-gray-500 rounded-full text-xs font-bold whitespace-nowrap dark:text-white active:scale-95 transition-transform">
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black dark:text-white">Popular near you</h3>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { name: 'The Place Restaurant', rating: '4.5', time: '20-30 min', fee: '₦500', img: 'food1' },
                    { name: 'Chicken Republic', rating: '4.2', time: '15-25 min', fee: '₦300', img: 'food2' },
                    { name: 'Mega Chicken', rating: '4.7', time: '30-45 min', fee: '₦700', img: 'food3' },
                  ].map((rest) => (
                    <div key={rest.name} className="group cursor-pointer">
                      <div className="aspect-[16/9] bg-uber-gray-100 dark:bg-uber-gray-500 rounded-2xl overflow-hidden mb-3 relative">
                        <img src={`https://picsum.photos/seed/${rest.img}/800/450`} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 right-4 bg-white dark:bg-uber-black p-2 rounded-full shadow-lg">
                          <Star size={16} className="fill-uber-black dark:fill-white dark:text-white" />
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-lg dark:text-white">{rest.name}</h4>
                          <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200 font-bold uppercase tracking-tight">
                            {rest.fee} Delivery Fee • {rest.time}
                          </p>
                        </div>
                        <div className="bg-uber-gray-50 dark:bg-uber-gray-500 px-2 py-1 rounded font-bold text-xs dark:text-white">
                          {rest.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-20" />
          </motion.div>
        )}

        {/* Referrals Screen */}
        {screen === 'referrals' && (
          <motion.div 
            key="referrals"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute inset-0 bg-white dark:bg-uber-black z-50 flex flex-col"
          >
            <div className="p-6 pt-14 border-b border-uber-gray-100 dark:border-uber-gray-500 flex items-center gap-4">
              <button onClick={() => setScreen('account')} className="p-2 -ml-2">
                <X size={24} className="dark:text-white" />
              </button>
              <h2 className="text-xl font-black dark:text-white">Refer a friend</h2>
            </div>
            <div className="flex-1 flex flex-col p-6">
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-uber-blue/10 text-uber-blue rounded-full flex items-center justify-center mb-8">
                  <User size={64} />
                </div>
                <h3 className="text-3xl font-black mb-4 dark:text-white">Give ₦1,000, Get ₦1,000</h3>
                <p className="text-uber-gray-500 dark:text-uber-gray-200 text-sm mb-10 max-w-xs">
                  Share your code with friends. When they take their first ride, you both get ₦1,000 in Glide X Cash.
                </p>
                
                <div className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-6 rounded-2xl border-2 border-dashed border-uber-gray-200 dark:border-uber-gray-400 mb-8">
                  <p className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-2">Your referral code</p>
                  <p className="text-2xl font-black tracking-widest dark:text-white">GLIDE-OPE-2026</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => showToast('Referral link copied to clipboard!', 'success')}
                  className="w-full bg-uber-black dark:bg-white text-white dark:text-uber-black py-4 rounded-xl font-black text-lg shadow-xl active:scale-[0.98] transition-transform"
                >
                  Share link
                </button>
                <p className="text-[10px] text-uber-gray-400 text-center uppercase font-bold tracking-widest">Terms and conditions apply</p>
              </div>
            </div>
          </motion.div>
        )}
        {screen === 'driver-signup' && (
          <motion.div 
            key="driver-signup"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute inset-0 bg-white dark:bg-uber-black z-50 flex flex-col"
          >
            {isCameraOpen && (
              <CameraCapture 
                onCapture={(img) => {
                  setCapturedSelfie(img);
                  setIsCameraOpen(false);
                }}
                onCancel={() => setIsCameraOpen(false)}
              />
            )}
            <div className="p-6 border-b border-uber-gray-100 dark:border-uber-gray-500 flex items-center gap-4">
              <button onClick={() => setScreen('home')} className="p-2 -ml-2">
                <X size={24} className="dark:text-white" />
              </button>
              <h2 className="text-xl font-black dark:text-white">Become a Driver</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-2 dark:text-white">Earn on your own schedule</h3>
                <p className="text-uber-gray-500 dark:text-uber-gray-200 text-sm">Join thousands of drivers in Lagos and start earning today.</p>
              </div>

              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                if (!capturedSelfie) {
                  showToast('Please complete face verification first.', 'error');
                  return;
                }
                showToast('Application submitted successfully!', 'success');
                setScreen('home');
              }}>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Phone Number</label>
                    <input required type="tel" placeholder="+234 000 000 0000" className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none focus:border-uber-black dark:focus:border-white dark:text-white" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">NIN (National ID)</label>
                      <input required type="text" placeholder="11-digit NIN" className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none focus:border-uber-black dark:focus:border-white dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Driver's License</label>
                      <input required type="text" placeholder="DL-000-XXX" className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none focus:border-uber-black dark:focus:border-white dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Car Type</label>
                      <select required className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none focus:border-uber-black dark:focus:border-white dark:text-white appearance-none">
                        <option>Sedan</option>
                        <option>SUV</option>
                        <option>Hatchback</option>
                        <option>Luxury</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">License Plate</label>
                      <input required type="text" placeholder="ABC-123-XY" className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none focus:border-uber-black dark:focus:border-white dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Car Model</label>
                      <input required type="text" placeholder="Toyota Corolla 2022" className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none focus:border-uber-black dark:focus:border-white dark:text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase">Car Color</label>
                      <input required type="text" placeholder="Silver" className="w-full bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-xl border border-uber-gray-100 dark:border-uber-gray-400 outline-none focus:border-uber-black dark:focus:border-white dark:text-white" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div 
                      onClick={() => document.getElementById('profile-upload')?.click()}
                      className="p-4 border-2 border-dashed border-uber-gray-200 dark:border-uber-gray-400 rounded-2xl flex flex-col items-center gap-2 cursor-pointer hover:bg-uber-gray-50 dark:hover:bg-uber-gray-500 transition-colors"
                    >
                      <input 
                        id="profile-upload"
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              // In a real app, we'd store this in state
                              showToast('Profile picture updated!', 'success');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="w-10 h-10 bg-uber-gray-100 dark:bg-uber-gray-500 rounded-full flex items-center justify-center">
                        <User size={20} className="text-uber-gray-500 dark:text-uber-gray-200" />
                      </div>
                      <p className="text-xs font-bold dark:text-white">Upload Profile Picture</p>
                    </div>

                    <div 
                      onClick={() => setIsCameraOpen(true)}
                      className={`p-4 border-2 border-dashed rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all ${capturedSelfie ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-uber-gray-200 dark:border-uber-gray-400 hover:bg-uber-gray-50 dark:hover:bg-uber-gray-500'}`}
                    >
                      {capturedSelfie ? (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <img src={capturedSelfie} alt="Selfie" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <RefreshCw size={20} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-uber-gray-100 dark:bg-uber-gray-500 rounded-full flex items-center justify-center">
                          <Camera size={20} className="text-uber-gray-500 dark:text-uber-gray-200" />
                        </div>
                      )}
                      <p className={`text-xs font-bold ${capturedSelfie ? 'text-green-600 dark:text-green-400' : 'dark:text-white'}`}>
                        {capturedSelfie ? 'Face Verified' : 'Face Verification (Selfie)'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-uber-black dark:bg-white text-white dark:text-uber-black py-4 rounded-xl font-black text-lg shadow-xl active:scale-[0.98] transition-transform">
                    Submit Application
                  </button>
                  <p className="text-[10px] text-uber-gray-400 text-center mt-4 px-6">
                    By submitting, you agree to Glide X's Driver Terms of Service and Privacy Policy.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Wallet Screen */}
        {screen === 'wallet' && (
          <motion.div 
            key="wallet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full bg-white dark:bg-uber-black flex flex-col"
          >
            <div className="p-6 pt-14 border-b border-uber-gray-100 dark:border-uber-gray-500 flex items-center gap-4">
              <button onClick={() => setScreen('home')} className="p-2 -ml-2">
                <X size={24} className="dark:text-white" />
              </button>
              <h2 className="text-xl font-black dark:text-white">Wallet</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="bg-uber-black dark:bg-white text-white dark:text-uber-black p-6 rounded-3xl shadow-xl">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Glide X Cash</p>
                <h3 className="text-4xl font-black mb-6">₦12,450.00</h3>
                <button className="bg-white/20 dark:bg-uber-black/10 px-6 py-2 rounded-full font-bold text-sm active:scale-95 transition-transform">
                  Add funds
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold dark:text-white">Payment methods</h3>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-uber-gray-50 dark:bg-uber-gray-500 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white dark:bg-uber-gray-400 rounded-xl flex items-center justify-center shadow-sm">
                          {method.type === 'card' ? <span className="text-[10px] font-black">{method.brand}</span> : <CreditCard size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-sm dark:text-white">{method.type === 'card' ? `•••• ${method.last4}` : method.label}</p>
                          <p className="text-[10px] text-uber-gray-500 dark:text-uber-gray-200 font-bold uppercase">{method.label}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-uber-gray-300" />
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setScreen('add-payment')}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-uber-gray-100 dark:border-uber-gray-500 text-uber-blue font-bold text-sm"
                >
                  + Add payment method
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold dark:text-white">Vouchers</h3>
                <div className="bg-uber-gray-50 dark:bg-uber-gray-500 p-6 rounded-2xl border-2 border-dashed border-uber-gray-100 dark:border-uber-gray-500 flex flex-col items-center text-center">
                  <Package size={32} className="text-uber-gray-300 mb-4" />
                  <p className="text-sm font-bold dark:text-white mb-1">No vouchers yet</p>
                  <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200 mb-4">Add a voucher code to get discounts on your next ride.</p>
                  <button className="text-uber-blue font-black text-xs uppercase tracking-widest">Add voucher code</button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold dark:text-white">Promotions</h3>
                <div className="bg-uber-blue/5 p-4 rounded-2xl border border-uber-blue/20 flex items-center gap-4">
                  <div className="w-12 h-12 bg-uber-blue/10 text-uber-blue rounded-full flex items-center justify-center">
                    <Star size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-sm dark:text-white">50% off next 3 rides</p>
                    <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">Valid until Oct 31, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Screen */}
        {screen === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full bg-white dark:bg-uber-black flex flex-col"
          >
            <div className="p-6 pt-14 border-b border-uber-gray-100 dark:border-uber-gray-500 flex items-center gap-4">
              <button onClick={() => setScreen('home')} className="p-2 -ml-2">
                <X size={24} className="dark:text-white" />
              </button>
              <h2 className="text-xl font-black dark:text-white">Settings</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase tracking-widest">Favorites</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-uber-gray-50 dark:bg-uber-gray-500 rounded-full flex items-center justify-center">
                      <Home size={18} className="dark:text-white" />
                    </div>
                    <div className="flex-1 border-b border-uber-gray-50 dark:border-uber-gray-500 pb-4">
                      <p className="font-bold text-sm dark:text-white">Home</p>
                      <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">Add home</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-uber-gray-50 dark:bg-uber-gray-500 rounded-full flex items-center justify-center">
                      <Briefcase size={18} className="dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm dark:text-white">Work</p>
                      <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">Add work</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase tracking-widest">Security</h3>
                {[
                  { label: 'Privacy Center', desc: 'Take control of your data' },
                  { label: 'Security', desc: 'Manage your account security' },
                  { label: '2-Step Verification', desc: 'Add an extra layer of security' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 cursor-pointer">
                    <div>
                      <p className="font-bold text-sm dark:text-white">{item.label}</p>
                      <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">{item.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-uber-gray-300" />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-uber-gray-500 dark:text-uber-gray-200 uppercase tracking-widest">App Appearance</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm dark:text-white">Dark Mode</p>
                    <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">Always use dark theme</p>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-uber-black' : 'bg-uber-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Nav */}
      {['home', 'activity', 'account'].includes(screen) && isAuthenticated && (
        <BottomNav activeScreen={screen} setScreen={setScreen} />
      )}

      {/* Safety Toolkit Modal */}
      <AnimatePresence>
        {isSafetyModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSafetyModalOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-uber-black rounded-t-[32px] p-6 z-[110] shadow-2xl"
            >
              <div className="w-10 h-1.5 bg-uber-gray-200 dark:bg-uber-gray-500 rounded-full mx-auto mb-6" />
              <h2 className="text-2xl font-black mb-6 dark:text-white">Safety Toolkit</h2>
              <div className="space-y-4">
                {[
                  { label: 'Share trip status', icon: <Navigation size={20} />, desc: 'Let friends and family track your ride' },
                  { label: 'Emergency assistance', icon: <Star size={20} />, desc: 'Call local emergency services', danger: true },
                  { label: 'Report a safety issue', icon: <Star size={20} />, desc: 'Tell us about a safety concern' },
                  { label: 'Ride Check', icon: <Clock size={20} />, desc: 'We check in if we detect an unusual stop' },
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => {
                      showToast(`${item.label} activated`, 'success');
                      setIsSafetyModalOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-uber-gray-50 dark:bg-uber-gray-500 hover:bg-uber-gray-100 dark:hover:bg-uber-gray-400 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.danger ? 'bg-red-100 text-red-600' : 'bg-white dark:bg-uber-black dark:text-white shadow-sm'}`}>
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${item.danger ? 'text-red-600' : 'dark:text-white'}`}>{item.label}</p>
                      <p className="text-[10px] text-uber-gray-500 dark:text-uber-gray-200">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setIsSafetyModalOpen(false)}
                className="w-full mt-6 py-4 bg-uber-black dark:bg-white text-white dark:text-uber-black rounded-xl font-black uppercase tracking-widest"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Message Driver Modal */}
      <AnimatePresence>
        {isMessageModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMessageModalOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-uber-black rounded-t-[32px] p-6 z-[110] shadow-2xl flex flex-col"
            >
              <div className="w-10 h-1.5 bg-uber-gray-200 dark:bg-uber-gray-500 rounded-full mx-auto mb-6" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-uber-gray-100 rounded-full overflow-hidden">
                  <img src="https://picsum.photos/seed/driver/200" alt="Driver" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-black dark:text-white">Message Chinedu</h2>
                  <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">Toyota Corolla • ABC-123-XY</p>
                </div>
              </div>
              
              <div className="bg-uber-gray-50 dark:bg-uber-gray-500 p-4 rounded-2xl mb-6 flex-1">
                <textarea 
                  autoFocus
                  placeholder="Type a message..."
                  value={driverMessage}
                  onChange={(e) => setDriverMessage(e.target.value)}
                  className="w-full h-32 bg-transparent outline-none dark:text-white font-bold resize-none"
                />
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
                {['I am here', 'Be right there', 'Where are you?', 'Thanks!'].map((quick) => (
                  <button 
                    key={quick}
                    onClick={() => setDriverMessage(quick)}
                    className="px-4 py-2 bg-uber-gray-100 dark:bg-uber-gray-400 rounded-full text-xs font-bold dark:text-white whitespace-nowrap"
                  >
                    {quick}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  if (driverMessage) {
                    showToast('Message sent!', 'success');
                    setDriverMessage('');
                    setIsMessageModalOpen(false);
                  }
                }}
                className="w-full py-4 bg-uber-black dark:bg-white text-white dark:text-uber-black rounded-xl font-black uppercase tracking-widest disabled:opacity-50"
                disabled={!driverMessage}
              >
                Send Message
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Share Trip Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-uber-black rounded-t-[32px] p-6 z-[110] shadow-2xl"
            >
              <div className="w-10 h-1.5 bg-uber-gray-200 dark:bg-uber-gray-500 rounded-full mx-auto mb-6" />
              <h2 className="text-2xl font-black mb-6 dark:text-white">Share Trip</h2>
              <p className="text-uber-gray-500 dark:text-uber-gray-200 text-sm mb-8">
                Let your contacts track your ride in real-time.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { name: 'Mom', phone: '+234 801 234 5678', initial: 'M' },
                  { name: 'Ayo', phone: '+234 812 345 6789', initial: 'A' },
                  { name: 'Sarah', phone: '+234 903 456 7890', initial: 'S' },
                ].map((contact) => (
                  <div key={contact.phone} className="flex items-center justify-between p-4 bg-uber-gray-50 dark:bg-uber-gray-500 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-uber-blue text-white rounded-full flex items-center justify-center font-black">
                        {contact.initial}
                      </div>
                      <div>
                        <p className="font-bold text-sm dark:text-white">{contact.name}</p>
                        <p className="text-xs text-uber-gray-500 dark:text-uber-gray-200">{contact.phone}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        showToast(`Trip shared with ${contact.name}`, 'success');
                        setIsShareModalOpen(false);
                      }}
                      className="px-4 py-2 bg-uber-black dark:bg-white text-white dark:text-uber-black rounded-full text-xs font-black"
                    >
                      Share
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="w-full py-4 bg-uber-gray-100 dark:bg-uber-gray-400 text-uber-black dark:text-white rounded-xl font-black uppercase tracking-widest"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cancel Ride Modal */}
      <AnimatePresence>
        {isCancelModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCancelModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[150]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-uber-black p-8 rounded-t-[32px] z-[160] shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-uber-gray-200 dark:bg-uber-gray-500 rounded-full mx-auto mb-8" />
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <X size={40} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-black text-center mb-4 dark:text-white">Cancel Ride?</h3>
              <p className="text-center text-uber-gray-500 dark:text-uber-gray-200 mb-10 font-medium leading-relaxed">
                Are you sure you want to cancel your ride? A cancellation fee may apply if the driver is already nearby.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    setScreen('home');
                    showToast('Ride cancelled successfully', 'info');
                  }}
                  className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-600/20 active:scale-[0.98] transition-all"
                >
                  Yes, Cancel Ride
                </button>
                <button 
                  onClick={() => setIsCancelModalOpen(false)}
                  className="w-full py-5 bg-uber-gray-50 dark:bg-uber-gray-500 text-uber-black dark:text-white rounded-2xl font-black uppercase tracking-widest active:scale-[0.98] transition-all"
                >
                  Keep Ride
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Ride Check Modal */}
      <AnimatePresence>
        {isRideCheckOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRideCheckOpen(false)}
              className="fixed inset-0 bg-black/60 z-[120]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-white dark:bg-uber-black rounded-[32px] p-8 z-[130] shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-uber-blue/10 text-uber-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="animate-pulse" />
              </div>
              <h2 className="text-2xl font-black mb-4 dark:text-white">Ride Check</h2>
              <p className="text-uber-gray-500 dark:text-uber-gray-200 text-sm mb-8">
                We noticed your ride has been stopped for a while. Is everything okay?
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => setIsRideCheckOpen(false)}
                  className="w-full py-4 bg-uber-black dark:bg-white text-white dark:text-uber-black rounded-xl font-black uppercase tracking-widest"
                >
                  I'm okay
                </button>
                <button 
                  onClick={() => {
                    setIsRideCheckOpen(false);
                    setIsSafetyModalOpen(true);
                  }}
                  className="w-full py-4 bg-uber-gray-50 dark:bg-uber-gray-500 text-uber-black dark:text-white rounded-xl font-black uppercase tracking-widest"
                >
                  I need help
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
