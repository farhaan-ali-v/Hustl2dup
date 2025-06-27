import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, ChevronDown, ChevronUp, Coffee, Book, Dog, Car, Utensils, Printer, GraduationCap, Dumbbell, ArrowRight, CheckCircle, Users, Shield, HelpCircle, Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { taskTemplateService } from '../lib/database';
import { Location } from '../lib/locationService';
import toast from 'react-hot-toast';
import FoodLocationModal from './FoodLocationModal';

interface TaskTemplatesProps {
  onSelectTemplate: (template: any) => void;
  onSelectLocation?: (location: Location) => void;
  onSelectTemplateWithLocation?: (template: any, location: any) => void;
}

const BUILT_IN_TEMPLATES = [
  {
    id: 'coffee-run',
    title: 'Coffee Runs',
    description: 'Get coffee from campus locations',
    icon: <Coffee className="w-6 h-6 text-[#FA4616]" />,
    category: 'coffee_run',
    estimated_time: '15-20 minutes',
    price: 8.00,
    image: "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?cs=srgb&dl=pexels-chevanon-324028.jpg&fm=jpg",
    locations: [
      {
        name: "Starbucks - Marston Science Library",
        address: "444 Newell Dr, Gainesville, FL 32611",
        coords: { lat: 29.6481, lng: -82.3439 },
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/200px-Starbucks_Corporation_Logo_2011.svg.png"
      },
      {
        name: "Starbucks - The Hub",
        address: "3025 SW 23rd St, Gainesville, FL 32608",
        coords: { lat: 29.6483, lng: -82.3459 },
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/200px-Starbucks_Corporation_Logo_2011.svg.png"
      },
      {
        name: "Einstein Bros Bagels - Shands Hospital",
        address: "1600 SW Archer Rd, Gainesville, FL 32610",
        coords: { lat: 29.6404, lng: -82.3447 },
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtQeTm1yJI_fgdRj1WXyxf7C7tp8N3_xLVqw&s"
      }
    ]
  },
  {
    id: 'food-pickup',
    title: 'Food Pickup',
    description: 'Pick up meals from dining halls and restaurants',
    icon: <Utensils className="w-6 h-6 text-[#FA4616]" />,
    category: 'delivery',
    estimated_time: '15-20 minutes',
    price: 8.00,
    image: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?cs=srgb&dl=pexels-ella-olsson-572949-1640772.jpg&fm=jpg",
    locations: [
      {
        name: "Chick-fil-A - Reitz Union",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://brandlogos.net/wp-content/uploads/2022/02/chick-fil-a-logo-brandlogos.net_.png"
      },
      {
        name: "Panda Express - Reitz Union",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://brandlogos.net/wp-content/uploads/2022/03/panda_express-logo-brandlogos.net_.png"
      },
      {
        name: "Subway - Reitz Union",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://download.logo.wine/logo/Subway_(restaurant)/Subway_(restaurant)-Logo.wine.png"
      },
      {
        name: "The Halal Shack - Reitz Union",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://cdn.prod.website-files.com/5efa207a59d29b5583d9972a/64f8b9e75bd0575518fecb1b_open-graph-the-halal-shack.png"
      },
      {
        name: "Baba's Pizza - Reitz Union",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=100&q=80"
      },
      {
        name: "Mi Apa Reitz - Reitz Union",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFkbl_5YqlGIOC4pPaecE4fL6zXVNn_7kvSg&s"
      },
      {
        name: "Cabo - Reitz Union",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyvo1m0zbjdoD-bmhyabHdq8anv9Z88g1o5Q&s"
      },
      {
        name: "Chick-fil-A - Shands Hospital",
        address: "Sun Terrace, Shands Hospital, UF Campus",
        coords: { lat: 29.6404, lng: -82.3447 },
        logo: "https://brandlogos.net/wp-content/uploads/2022/02/chick-fil-a-logo-brandlogos.net_.png"
      },
      {
        name: "Panda Express - Shands Hospital",
        address: "Sun Terrace, Shands Hospital, UF Campus",
        coords: { lat: 29.6404, lng: -82.3447 },
        logo: "https://brandlogos.net/wp-content/uploads/2022/03/panda_express-logo-brandlogos.net_.png"
      },
      {
        name: "Starbucks - Shands Hospital",
        address: "1600 SW Archer Rd, Gainesville, FL 32610",
        coords: { lat: 29.6404, lng: -82.3447 },
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/200px-Starbucks_Corporation_Logo_2011.svg.png"
      },
      {
        name: "Gator Corner Dining Center",
        address: "Gale Lemerand Dr, Gainesville, FL 32603",
        coords: { lat: 29.6490, lng: -82.3512 },
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdH5vND6t5OF3LD_Rg7oXuFHCYUNOeIe7LlA&s"
      },
      {
        name: "Broward Dining Hall",
        address: "Broward Hall, Gainesville, FL 32612",
        coords: { lat: 29.6465, lng: -82.3419 },
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdH5vND6t5OF3LD_Rg7oXuFHCYUNOeIe7LlA&s"
      },
      {
        name: "Fresh Food Company",
        address: "Broward Hall, Gainesville, FL 32612",
        coords: { lat: 29.6465, lng: -82.3419 },
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdH5vND6t5OF3LD_Rg7oXuFHCYUNOeIe7LlA&s"
      },
      {
        name: "Pollo Tropical - Reitz Union",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdH5vND6t5OF3LD_Rg7oXuFHCYUNOeIe7LlA&s"
      },
      {
        name: "Steak 'n Shake - Reitz Union",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdH5vND6t5OF3LD_Rg7oXuFHCYUNOeIe7LlA&s"
      },
      {
        name: "Wendy's - Reitz Union",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdH5vND6t5OF3LD_Rg7oXuFHCYUNOeIe7LlA&s"
      }
    ]
  },
  {
    id: 'print-study-pickup',
    title: 'Print & Study Pickup',
    description: 'Print homework, practice tests, or grab textbooks from campus',
    icon: <Printer className="w-6 h-6 text-[#FA4616]" />,
    category: 'academic_help',
    estimated_time: '15-30 minutes',
    price: 6.00,
    image: "https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    locations: [
      {
        name: "UF Bookstore (Reitz Union)",
        address: "686 Museum Rd, Gainesville, FL 32611",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
      },
      {
        name: "Library West (1545 W University Ave)",
        address: "1545 W University Ave, Gainesville, FL 32603",
        coords: { lat: 29.6515, lng: -82.3429 },
        logo: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=100&q=80"
      },
      {
        name: "Marston Science Library",
        address: "444 Newell Dr, Gainesville, FL 32611",
        coords: { lat: 29.6481, lng: -82.3439 },
        logo: "https://ufl.pb.unizin.org/app/uploads/sites/128/2022/07/msl-basement-scaled.jpg"
      }
    ]
  },
  {
    id: 'workout-partner',
    title: 'Workout Partner',
    description: 'Find a gym or sports buddy for your next workout or pickup game',
    icon: <Dumbbell className="w-6 h-6 text-[#FA4616]" />,
    category: 'other',
    estimated_time: '30-60 minutes',
    price: 0.00,
    is_free: true,
    image: "https://www.gainesvillesportscommission.com/wp-content/uploads/2019/02/southwest-recreation-center.jpg",
    locations: [
      {
        name: "Student Rec Center",
        address: "1864 Stadium Rd, Gainesville, FL 32611",
        coords: { lat: 29.6502, lng: -82.3478 },
        logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=100&q=80"
      },
      {
        name: "Southwest Rec",
        address: "3150 Hull Rd, Gainesville, FL 32611",
        coords: { lat: 29.6384, lng: -82.3687 },
        logo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=100&q=80"
      },
      {
        name: "Broward Courts",
        address: "Broward Hall, Gainesville, FL 32612",
        coords: { lat: 29.6465, lng: -82.3419 },
        logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=100&q=80"
      },
      {
        name: "Flavet Field",
        address: "1864 Stadium Rd, Gainesville, FL 32611",
        coords: { lat: 29.6520, lng: -82.3380 },
        logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=100&q=80"
      }
    ]
  },
  {
    id: 'campus-rides',
    title: 'Campus Quick Rides',
    description: 'Get a ride around campus or to nearby locations',
    icon: <Car className="w-6 h-6 text-[#FA4616]" />,
    category: 'transportation',
    estimated_time: '10-20 minutes',
    price: 8.00,
    image: "https://media.istockphoto.com/id/1644775768/photo/an-unrecognizable-businessman-driving-his-car.jpg?s=612x612&w=0&k=20&c=pWqIRpn3nH2AItVB4J5e5F1_AB4Fv6PtoyYUEMMpLaw=",
    locations: [
      {
        name: "Reitz Union",
        address: "J. Wayne Reitz Union, UF Campus",
        coords: { lat: 29.6463, lng: -82.3478 },
        logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=100&q=80"
      },
      {
        name: "Sorority Row",
        address: "Sorority Row, UF Campus",
        coords: { lat: 29.6449, lng: -82.3399 },
        logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=100&q=80"
      }
    ]
  },
  {
    id: 'dog-walking',
    title: 'Dog Walking',
    description: 'Walk dogs around campus areas',
    icon: <Dog className="w-6 h-6 text-[#FA4616]" />,
    category: 'pet_care',
    estimated_time: '30-45 minutes',
    price: 10.00,
    image: "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    locations: [
      {
        name: "Lake Alice",
        address: "Lake Alice, UF Campus",
        coords: { lat: 29.6428, lng: -82.3609 },
        logo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=100&q=80"
      },
      {
        name: "Plaza of the Americas",
        address: "Plaza of the Americas, UF Campus",
        coords: { lat: 29.6494, lng: -82.3438 },
        logo: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=100&q=80"
      }
    ]
  }
];

const TaskTemplates: React.FC<TaskTemplatesProps> = ({ 
  onSelectTemplate, 
  onSelectLocation,
  onSelectTemplateWithLocation
}) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({});
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedTemplateForLocations, setSelectedTemplateForLocations] = useState<any>(null);

  // Hero section content with matching images
  const heroContent = [
    {
      title: "Need help studying?",
      subtitle: "Find study partners or get materials delivered",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      tag: "Study Buddy",
      tagIcon: <Book className="w-5 h-5 text-[#0038FF]" />,
      tagTime: "60 min",
      tagPrice: "FREE"
    },
    {
      title: "Running late for class?",
      subtitle: "Get coffee delivered right to you",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
      tag: "Coffee Run",
      tagIcon: <Coffee className="w-5 h-5 text-[#0038FF]" />,
      tagTime: "15 min",
      tagPrice: "$8"
    },
    {
      title: "Out of time for errands?",
      subtitle: "Get help with campus tasks and deliveries",
      image: "https://unsplash.com/photos/woman-in-white-t-shirt-standing-in-front-of-woman-in-yellow-t-shirt-cNlBqwaGhEk",
      tag: "Campus Errands",
      tagIcon: <Utensils className="w-5 h-5 text-[#0038FF]" />,
      tagTime: "20 min",
      tagPrice: "$10"
    },
    {
      title: "Forgot to print again?",
      subtitle: "Get your documents delivered to you",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
      tag: "Print Delivery",
      tagIcon: <Printer className="w-5 h-5 text-[#0038FF]" />,
      tagTime: "15 min",
      tagPrice: "$5"
    },
    {
      title: "Grab tasks between classes",
      subtitle: "Earn money helping fellow students",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      tag: "Quick Tasks",
      tagIcon: <DollarSign className="w-5 h-5 text-[#0038FF]" />,
      tagTime: "30 min",
      tagPrice: "$15"
    }
  ];

  useEffect(() => {
    loadTemplates();
    
    // Set up hero rotation interval
    const heroInterval = setInterval(() => {
      setCurrentHeroIndex(prevIndex => (prevIndex + 1) % heroContent.length);
    }, 5000);
    
    // Set up testimonial rotation interval
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex(prevIndex => (prevIndex + 1) % testimonials.length);
    }, 4000);
    
    return () => {
      clearInterval(heroInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      
      // Try to load templates from the database
      let templatesData = [];
      try {
        templatesData = await taskTemplateService.getTemplates();
      } catch (error) {
        console.warn('Error loading templates from database, using built-in templates:', error);
      }
      
      // If no templates from database, use built-in templates
      if (!templatesData || templatesData.length === 0) {
        templatesData = BUILT_IN_TEMPLATES;
      }
      
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Error loading task templates');
      
      // Fallback to built-in templates
      setTemplates(BUILT_IN_TEMPLATES);
    } finally {
      setLoading(false);
    }
  };

  const toggleLocationExpand = (templateId: string) => {
    setExpandedLocations(prev => ({
      ...prev,
      [templateId]: !prev[templateId]
    }));
  };

  const handleSelectTemplate = (template: any) => {
    onSelectTemplate(template);
  };

  const handleSelectLocation = (template: any, location: any) => {
    if (onSelectTemplateWithLocation) {
      onSelectTemplateWithLocation(template, location);
    } else {
      // Fallback if the combined function is not provided
      onSelectTemplate(template);
      if (onSelectLocation) {
        onSelectLocation({
          lat: location.coords.lat,
          lng: location.coords.lng,
          address: location.address
        });
      }
    }
  };

  const handleViewAllLocations = (template: any) => {
    setSelectedTemplateForLocations(template);
    setShowLocationModal(true);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'delivery', name: 'Delivery' },
    { id: 'coffee_run', name: 'Coffee Run' },
    { id: 'academic_help', name: 'Academic Help' },
    { id: 'pet_care', name: 'Pet Care' },
    { id: 'transportation', name: 'Transportation' },
    { id: 'other', name: 'Other' }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Aryan S.",
      major: "Economics",
      year: "Junior",
      rating: 5,
      service: "Coffee Run",
      quote: "Hustl saved me during finals week when I needed a quick coffee run while I was cramming in the library. The app is super easy to use and everyone is so helpful."
    },
    {
      id: 2,
      name: "Jessica L.",
      major: "Biology",
      year: "Sophomore",
      rating: 5,
      service: "Print & Study Pickup",
      quote: "I forgot to print my lab report and had 10 minutes before class. Someone delivered it right to my classroom door! Absolute lifesaver."
    },
    {
      id: 3,
      name: "Michael T.",
      major: "Computer Science",
      year: "Senior",
      rating: 5,
      service: "Food Delivery",
      quote: "As a CS major, I practically live in the lab. Being able to get food delivered directly there has been a game-changer for my productivity."
    },
    {
      id: 4,
      name: "Sophia R.",
      major: "Psychology",
      year: "Freshman",
      rating: 5,
      service: "Campus Rides",
      quote: "Being new to campus, I wasn't familiar with all the buildings. Getting rides to my classes during the first week helped me so much!"
    },
    {
      id: 5,
      name: "David K.",
      major: "Engineering",
      year: "Junior",
      rating: 5,
      service: "Dog Walking",
      quote: "My lab sessions run long and my dog needs walks. Fellow students help me take care of my pup when I'm stuck in class. Worth every penny!"
    },
    {
      id: 6,
      name: "Emma W.",
      major: "Journalism",
      year: "Senior",
      rating: 5,
      service: "Workout Partner",
      quote: "Found an awesome gym buddy through Hustl! Having someone to work out with keeps me accountable and makes fitness way more fun."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const currentTestimonial = testimonials[currentTestimonialIndex];
  const currentHero = heroContent[currentHeroIndex];

  return (
    <div>
      {/* Hero Section with Dynamic Content */}
      <div className="bg-[#002B7F] text-white rounded-xl overflow-hidden mb-10">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{currentHero.title}</h2>
            <p className="text-xl mb-6">{currentHero.subtitle}</p>
            <p className="text-gray-200 mb-8">Campus errands, covered. Coffee runs, printing, pet care — Hustl connects Gators in minutes.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('create-task'))}
                className="bg-[#FF5A1F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E63A0B] transition duration-200 flex items-center justify-center"
              >
                Post a Task <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('view-tasks'))}
                className="bg-white text-[#002B7F] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
              >
                Browse Tasks
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <img 
              src={currentHero.image}
              alt={currentHero.title} 
              className="w-full h-full object-cover transition-opacity duration-500"
              style={{ minHeight: "300px" }}
            />
            <div className="absolute bottom-6 right-6">
              <div className="bg-[#0038FF] text-white rounded-lg p-3 shadow-lg">
                <div className="flex items-center">
                  {currentHero.tagIcon}
                  <div className="ml-2">
                    <p className="font-medium">{currentHero.tag}</p>
                    <p className="text-sm">{currentHero.tagTime} • {currentHero.tagPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Popular Tasks</h2>
        <p className="text-gray-600">
          Choose from our most popular task templates or create your own
        </p>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0038FF]"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0038FF]"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0038FF]"></div>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 overflow-hidden"
            >
              {template.image && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{template.title}</h3>
                  <span className="text-xl font-bold text-[#FA4616]">
                    {template.price === 0 ? 'FREE' : `$${template.price.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{template.estimated_time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{template.locations?.length || 0} locations</span>
                  </div>
                </div>

                {template.locations && template.locations.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => toggleLocationExpand(template.id)}
                      className="flex items-center justify-between w-full text-sm text-[#0038FF] hover:text-[#0021A5] transition-colors"
                    >
                      <span>Popular Locations</span>
                      {expandedLocations[template.id] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {expandedLocations[template.id] && (
                      <div className="mt-2 space-y-2">
                        {template.locations.slice(0, 3).map((location, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => handleSelectLocation(template, location)}
                          >
                            <div className="flex items-center">
                              {location.logo ? (
                                <img
                                  src={location.logo}
                                  alt={location.name}
                                  className="w-8 h-8 rounded-full object-cover mr-2"
                                />
                              ) : (
                                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                              )}
                              <div>
                                <p className="text-sm font-medium">{location.name}</p>
                                <p className="text-xs text-gray-500">{location.address.split(',')[0]}</p>
                              </div>
                            </div>
                            <MapPin className="w-4 h-4 text-[#0038FF]" />
                          </div>
                        ))}
                        {template.locations.length > 3 && (
                          <button
                            className="text-sm text-[#0038FF] hover:text-[#0021A5] transition-colors w-full text-center py-2 border-t border-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewAllLocations(template);
                            }}
                          >
                            View All {template.locations.length} Locations
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleSelectTemplate(template)}
                  className="w-full bg-gradient-to-r from-[#0038FF] to-[#0021A5] text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition duration-200 shadow-md"
                >
                  Select Task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Need Something Else Section */}
      <div className="bg-[#002B7F] text-white rounded-xl p-8 text-center my-12">
        <h2 className="text-2xl font-bold mb-2">Need Something Else?</h2>
        <p className="mb-6">Create a custom task for anything you need help with on campus.</p>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('create-task'))}
          className="bg-[#FF5A1F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E63A0B] transition duration-200 inline-block"
        >
          Create Custom Task
        </button>
      </div>

      {/* How Hustl Works Section */}
      <div className="my-16">
        <h2 className="text-3xl font-bold text-center mb-4">How Hustl Works</h2>
        <p className="text-center text-gray-600 mb-12">Getting help is as easy as 1-2-3</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FF5A1F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-bold mb-2">Post Your Task</h3>
            <p className="text-gray-600">Describe what you need help with and set your budget</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-[#002B7F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-bold mb-2">Get Matched</h3>
            <p className="text-gray-600">Ready students will see your task and offer to help</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-[#FF5A1F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-bold mb-2">Task Complete</h3>
            <p className="text-gray-600">Chat with your helper, track progress, and rate your experience</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">What Students Are Saying</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of UF students already using Hustl to connect, help each other, and build a stronger campus community.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Student ID verification required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Real-time chat and tracking</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Community ratings and reviews</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>24/7 support team</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#002B7F] text-white rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center text-[#002B7F] text-xl font-bold mr-4">
              {currentTestimonial.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold">{currentTestimonial.name}</h3>
              <p className="text-sm">{currentTestimonial.major} • {currentTestimonial.year}</p>
            </div>
          </div>
          
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400" fill="#FBBF24" />
            ))}
          </div>
          
          <p className="text-sm mb-2">Used for: {currentTestimonial.service}</p>
          
          <div className="border-l-4 border-[#FF5A1F] pl-4 italic">
            "{currentTestimonial.quote}"
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="flex space-x-1">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentTestimonialIndex ? 'bg-white' : 'bg-blue-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={prevTestimonial}
                className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="my-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Hustl</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#002B7F]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
            <p className="text-gray-600">Verified UF students only with built-in safety features and secure payments.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[#002B7F]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Campus Community</h3>
            <p className="text-gray-600">Connect with fellow Gators in a trusted, campus-focused environment.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-[#002B7F]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Flexible Earnings</h3>
            <p className="text-gray-600">Set your own schedule and earn money helping other students.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 rounded-xl p-8 text-center my-12">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">Join thousands of UF students already using Hustl to connect and help each other.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('create-task'))}
            className="bg-[#FF5A1F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E63A0B] transition duration-200"
          >
            Post a Task
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('view-tasks'))}
            className="bg-[#002B7F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#001B8C] transition duration-200"
          >
            Browse Tasks
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="border-t pt-12 mt-12">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-2">Need Help?</h3>
          <p className="text-gray-600">Our support team is available 24/7</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-faq'))}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="w-5 h-5 mr-2 text-[#002B7F]" />
            <span>FAQs</span>
          </button>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-support'))}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="w-5 h-5 mr-2 text-[#002B7F]" />
            <span>Contact Support</span>
          </button>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-safety'))}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Shield className="w-5 h-5 mr-2 text-[#002B7F]" />
            <span>Safety Center</span>
          </button>
        </div>
      </div>

      {/* Food Location Modal */}
      {showLocationModal && selectedTemplateForLocations && (
        <FoodLocationModal
          locations={selectedTemplateForLocations.locations || []}
          onClose={() => setShowLocationModal(false)}
          onSelectLocation={(location) => {
            handleSelectLocation(selectedTemplateForLocations, location);
            setShowLocationModal(false);
          }}
          title={`${selectedTemplateForLocations.title} Locations`}
        />
      )}
    </div>
  );
};

export default TaskTemplates;