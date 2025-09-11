import React, { useState, useEffect, useMemo } from 'react';
import { Award, Briefcase, Users, BookOpen, MapPin, Phone, Mail, Twitter, Linkedin, Facebook, Instagram, Menu, X, Cpu, Settings, Building2, RadioTower, ChevronLeft, ChevronRight, GraduationCap, Building, Star } from 'lucide-react';

// --- Data based on Mongoose Schema ---
// Isko aap baad mein API se fetch kar sakte hain
const collegeData = {
    name: "National Institute of Technology, Bihar Sharif",
    logoUrl: "https://placehold.co/50x50/003366/FFFFFF?text=NITB",
    heroImage: "",
    establishmentDate: "2008-07-28T00:00:00.000Z",
    type: "Public Technical University",
    affiliationId: "UGC-AICTE-1234",
    capacity: 5000,
    tagline: "Fostering Innovation and Excellence in the Heart of Bihar.",

    // Naya data for vision/mission page
    vision: "To be a center of excellence in technical education and research, producing globally competent professionals who are innovative, entrepreneurial, and socially responsible.",
    mission: [
        "To impart quality education and training in various fields of engineering and technology.",
        "To foster a spirit of research, innovation, and creativity among students and faculty.",
        "To inculcate ethical values and a sense of social responsibility.",
        "To establish strong collaborations with industry and research organizations."
    ],

    // messageFrom schema
    messageFrom: {
        role: "Director",
        name: "Dr. Alok Verma",
        photoUrl: "https://placehold.co/400x400/E2E8F0/475569?text=Director",
        message: "Welcome to NIT Bihar Sharif, an institution committed to academic excellence and holistic development. We believe in nurturing talent and fostering an environment where students can thrive intellectually and personally. Our state-of-the-art facilities and dedicated faculty are here to guide you towards a future of limitless possibilities."
    },

    // administration schema
    administration: [
        { slno: 1, name: "Dr. Anjali Singh", designation: "Dean, Academics", email: "dean.academics@nitbihar.ac.in" },
        { slno: 2, name: "Prof. Rajesh Kumar", designation: "Dean, Student Welfare", email: "dean.sw@nitbihar.ac.in" },
        { slno: 3, name: "Mr. Sameer Sharma", designation: "Registrar", email: "registrar@nitbihar.ac.in" },
        { slno: 4, name: "Dr. Priya Desai", designation: "Head, Training & Placement", email: "head.tnp@nitbihar.ac.in" }
    ],

    // courses schema (simplified for frontend)
    courses: [
        { id: 'cse', name: "Computer Science & Engineering", icon: Cpu, seats: 120 },
        { id: 'mech', name: "Mechanical Engineering", icon: Settings, seats: 120 },
        { id: 'civil', name: "Civil Engineering", icon: Building2, seats: 60 },
        { id: 'ece', name: "Electronics & Communication", icon: RadioTower, seats: 60 },
        { id: 'eee', name: "Electrical & Electronics Engineering", icon: BookOpen, seats: 60 },
        { id: 'it', name: "Information Technology", icon: GraduationCap, seats: 60 },
    ],

    // placement schema
    placement: {
        highestPackage: "45 LPA",
        averagePackage: "12.5 LPA",
        placementPercentage: 95,
        topRecruiters: [
            { company: "Google", logo: "https://cdn.worldvectorlogo.com/logos/google-1-1.svg" },
            { company: "Microsoft", logo: "https://cdn.worldvectorlogo.com/logos/microsoft-5.svg" },
            { company: "Amazon", logo: "https://cdn.worldvectorlogo.com/logos/amazon-2.svg" },
            { company: "TCS", logo: "https://cdn.worldvectorlogo.com/logos/tata-consultancy-services.svg" },
            { company: "Infosys", logo: "https://cdn.worldvectorlogo.com/logos/infosys-2.svg" },
            { company: "Wipro", logo: "https://cdn.worldvectorlogo.com/logos/wipro-2.svg" },
        ]
    },

    // Gallery for Student Life page
    gallery: [
        { src: "", alt: "Library" },
{
    src: "https://placehold.co/400x300/E2E8F0/475569?text=Science+Lab",
    alt: "Science Lab"
},
        { src: "", alt: "Cultural Fest" },
        { src: "", alt: "Sports Arena" },
{ src: "", alt: "Student Common Room" },
{ src: "", alt: "Computer Lab" },
{ src: "", alt: "Auditorium" },
{ src: "", alt: "Campus Pathway" },
    ],

// contact & location schema
location: {
    address: "NH 31, near Pawapuri",
        city: "Bihar Sharif",
            state: "Bihar",
                pincode: "803118"
},
contact: {
    email: "info@nitbihar.ac.in",
        phone: "+91 12345 67890"
},

// socialmedia schema
socialmedia: {
    twitter: "#",
        linkedin: "#",
            facebook: "#",
                instagram: "#"
}
};

// --- Helper Components ---
const AnimateOnScroll = ({ children }) => {
    const ref = React.useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            }, { threshold: 0.1 }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className="animate-on-scroll">
            {children}
        </div>
    );
};

// --- Layout Components ---
const Header = ({ setPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = [
        { name: "Home", path: "home" },
        { name: "About Us", path: "about" },
        { name: "Vision & Mission", path: "vision" },
        { name: "Academics", path: "academics" },
        { name: "Placements", path: "placements" },
        { name: "Student Life", path: "student-life" },
        { name: "Contact", path: "contact" },
    ];

    const handleNavClick = (path) => {
        setPage(path);
        window.location.hash = path;
        setIsMenuOpen(false);
    }

    return (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <nav className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
                        <img src={collegeData.logoUrl} alt="College Logo" className="h-10 w-10" />
                        <span className="text-xl font-bold text-gray-800 hidden md:block">{collegeData.name.split(',')[0]}</span>
                    </div>
                    <div className="hidden lg:flex gap-8 items-center">
                        {navLinks.map(link => (
                            <a key={link.path} href={`#${link.path}`} onClick={(e) => { e.preventDefault(); handleNavClick(link.path) }} className="text-gray-600 hover:text-blue-700 font-medium">{link.name}</a>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hidden sm:block">Apply Now</a>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-gray-700">
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </nav>
            </div>
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t">
                    {navLinks.map(link => (
                        <a key={link.path} href={`#${link.path}`} onClick={(e) => { e.preventDefault(); handleNavClick(link.path) }} className="block py-3 px-4 text-gray-600 hover:bg-gray-100">{link.name}</a>
                    ))}
                    <div className="p-4">
                        <a href="#" className="bg-blue-600 text-white w-full block text-center px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">Apply Now</a>
                    </div>
                </div>
            )}
        </header>
    );
};

const Footer = ({ setPage }) => {
    const fullAddress = `${collegeData.location.address}, ${collegeData.location.city}, ${collegeData.location.state} ${collegeData.location.pincode}, India`;
    return (
        <footer className="bg-gray-800 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src={collegeData.logoUrl.replace('003366/FFFFFF', 'FFFFFF/003366')} alt="College Logo" className="h-10 w-10" />
                            <span className="text-xl font-bold">{collegeData.name.split(',')[0]}</span>
                        </div>
                        <p className="text-gray-400">A premier institution for technical education and research, dedicated to producing future leaders.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#about" onClick={(e) => { e.preventDefault(); setPage('about') }} className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="#academics" onClick={(e) => { e.preventDefault(); setPage('academics') }} className="text-gray-400 hover:text-white">Admissions</a></li>
                            <li><a href="#placements" onClick={(e) => { e.preventDefault(); setPage('placements') }} className="text-gray-400 hover:text-white">Placements</a></li>
                            <li><a href="#student-life" onClick={(e) => { e.preventDefault(); setPage('student-life') }} className="text-gray-400 hover:text-white">Student Life</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <address className="not-italic text-gray-400 space-y-3">
                            <p className="flex gap-2"><MapPin className="h-5 w-5 flex-shrink-0 mt-1" /><span>{fullAddress}</span></p>
                            <p className="flex gap-2"><Phone className="h-5 w-5 flex-shrink-0 mt-1" /><a href={`tel:${collegeData.contact.phone}`} className="hover:text-white">{collegeData.contact.phone}</a></p>
                            <p className="flex gap-2"><Mail className="h-5 w-5 flex-shrink-0 mt-1" /><a href={`mailto:${collegeData.contact.email}`} className="hover:text-white">{collegeData.contact.email}</a></p>
                        </address>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Our Location</h3>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178650538803!2d85.51739261500958!3d25.19717018389658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f26f0e4e2d3f2d%3A0x8e21971f1e6f4f2e!2sNalanda%20College%20of%20Engineering%2C%20Chandi!5e0!3m2!1sen!2sin!4v1678886000000"
                            width="100%" height="150" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                            className="rounded-lg" referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} {collegeData.name.split(',')[0]}. All Rights Reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        {collegeData.socialmedia.twitter && <a href={collegeData.socialmedia.twitter} className="text-gray-400 hover:text-white"><Twitter /></a>}
                        {collegeData.socialmedia.linkedin && <a href={collegeData.socialmedia.linkedin} className="text-gray-400 hover:text-white"><Linkedin /></a>}
                        {collegeData.socialmedia.facebook && <a href={collegeData.socialmedia.facebook} className="text-gray-400 hover:text-white"><Facebook /></a>}
                        {collegeData.socialmedia.instagram && <a href={collegeData.socialmedia.instagram} className="text-gray-400 hover:text-white"><Instagram /></a>}
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- Page Components ---

const HomePage = () => {
    const yearsOfExcellence = new Date().getFullYear() - new Date(collegeData.establishmentDate).getFullYear();

    const RecruiterSlider = () => {
        const sliderRef = React.useRef(null);
        const scrollAmount = 300;
        const doubledRecruiters = [...collegeData.placement.topRecruiters, ...collegeData.placement.topRecruiters];

        return (
            <div className="relative group">
                <div ref={sliderRef} className="flex items-center gap-12 overflow-x-scroll snap-x snap-mandatory placement-slider py-4">
                    {doubledRecruiters.map((recruiter, index) => (
                        <div key={index} className="flex-shrink-0 snap-center">
                            <img src={recruiter.logo} alt={recruiter.company} className="h-16 grayscale hover:grayscale-0 transition-all duration-300" title={recruiter.company} />
                        </div>
                    ))}
                </div>
                <button onClick={() => sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity ml-2"><ChevronLeft /></button>
                <button onClick={() => sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity mr-2"><ChevronRight /></button>
            </div>
        )
    }

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center text-white">
                <div className="absolute inset-0 bg-cover bg-center hero-gradient" style={{ backgroundImage: `url(${collegeData.heroImage})` }}></div>
                <div className="relative z-10 text-center px-4">
                    <AnimateOnScroll>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">{collegeData.name}</h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200 mb-8">{collegeData.tagline}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#academics" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform hover:scale-105 shadow-lg">Explore Programs</a>
                            <a href="#" className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-transform hover:scale-105">Take a Virtual Tour</a>
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>
            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <AnimateOnScroll><div className="p-4"><Award className="h-12 w-12 mx-auto text-blue-600 mb-2" /><p className="text-4xl font-bold text-gray-800">{yearsOfExcellence}+</p><p className="text-gray-500">Years of Excellence</p></div></AnimateOnScroll>
                        <AnimateOnScroll><div className="p-4"><Briefcase className="h-12 w-12 mx-auto text-blue-600 mb-2" /><p className="text-4xl font-bold text-gray-800">{collegeData.placement.placementPercentage}%</p><p className="text-gray-500">Placement Rate</p></div></AnimateOnScroll>
                        <AnimateOnScroll><div className="p-4"><Users className="h-12 w-12 mx-auto text-blue-600 mb-2" /><p className="text-4xl font-bold text-gray-800">{collegeData.capacity}+</p><p className="text-gray-500">Students Enrolled</p></div></AnimateOnScroll>
                        <AnimateOnScroll><div className="p-4"><BookOpen className="h-12 w-12 mx-auto text-blue-600 mb-2" /><p className="text-4xl font-bold text-gray-800">{collegeData.courses.length}+</p><p className="text-gray-500">Programs Offered</p></div></AnimateOnScroll>
                    </div>
                </div>
            </section>
            {/* Director's Message */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-5 gap-12 items-center">
                        <AnimateOnScroll><div className="md:col-span-2"><img src={collegeData.messageFrom.photoUrl} alt="Director's Photo" className="rounded-lg shadow-2xl w-full" /></div></AnimateOnScroll>
                        <AnimateOnScroll><div className="md:col-span-3">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Message from the <span className="text-blue-700">{collegeData.messageFrom.role}</span></h2>
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">{collegeData.messageFrom.name}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{collegeData.messageFrom.message}</p>
                            <a href="#about" onClick={(e) => { e.preventDefault(); window.location.hash = 'about' }} className="text-blue-600 font-semibold hover:underline">Learn more about our vision &rarr;</a>
                        </div></AnimateOnScroll>
                    </div>
                </div>
            </section>
            {/* Placements */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Top Recruiters</h2>
                    <AnimateOnScroll>
                        <RecruiterSlider />
                    </AnimateOnScroll>
                    <div className="text-center mt-8">
                        <a href="#placements" onClick={(e) => { e.preventDefault(); window.location.hash = 'placements' }} className="text-blue-600 font-semibold hover:underline">View Full Placement Report &rarr;</a>
                    </div>
                </div>
            </section>
        </>
    );
};

const AboutPage = () => (
    <div className="container mx-auto px-4 py-20">
        <AnimateOnScroll>
            <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">About {collegeData.name.split(',')[0]}</h1>
            <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16">
                Established in {new Date(collegeData.establishmentDate).getFullYear()}, we are a premier institution for technical education and research in India, dedicated to producing future leaders and innovators.
            </p>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimateOnScroll>
                <img src="" alt="College Campus" className="rounded-lg shadow-xl w-full h-auto" />
            </AnimateOnScroll>
            <AnimateOnScroll>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our History & Legacy</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Founded with the aim to provide top-tier technical education in the region, NIT Bihar Sharif has grown exponentially over the years. We are proud of our affiliation with {collegeData.affiliationId} and our commitment to upholding the highest standards of academic integrity. Our campus is a melting pot of cultures, ideas, and innovations.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    From our humble beginnings to becoming a beacon of technical learning, our journey is a testament to the dedication of our faculty, the brilliance of our students, and the unwavering support of our community.
                </p>
            </AnimateOnScroll>
        </div>
        <AdministrationPage short={true} />
    </div>
);

const VisionMissionPage = () => (
    <div className="bg-white">
        <div className="container mx-auto px-4 py-20">
            <AnimateOnScroll>
                <h1 className="text-4xl font-bold text-center mb-16 text-gray-800">Our Vision & Mission</h1>
            </AnimateOnScroll>
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <AnimateOnScroll>
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <Star className="h-10 w-10 text-blue-600" />
                            <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{collegeData.vision}</p>
                    </div>
                </AnimateOnScroll>
                <AnimateOnScroll>
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <GraduationCap className="h-10 w-10 text-blue-600" />
                            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
                        </div>
                        <ul className="space-y-4 text-gray-600 list-disc list-inside">
                            {collegeData.mission.map((point, index) => <li key={index}>{point}</li>)}
                        </ul>
                    </div>
                </AnimateOnScroll>
            </div>
        </div>
    </div>
);

const AcademicsPage = () => (
    <div className="container mx-auto px-4 py-20">
        <AnimateOnScroll>
            <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Academic Programs</h1>
            <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16">
                We offer a comprehensive range of undergraduate and postgraduate programs meticulously designed to meet and exceed the current industry standards.
            </p>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collegeData.courses.map(course => (
                <AnimateOnScroll key={course.id}>
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                        <div className="mb-4 inline-block p-4 bg-blue-100 rounded-full">
                            <course.icon className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h3>
                        <p className="text-gray-500">Intake: {course.seats} Students</p>
                    </div>
                </AnimateOnScroll>
            ))}
        </div>
    </div>
);

const PlacementsPage = () => (
    <div className="bg-white">
        <div className="container mx-auto px-4 py-20">
            <AnimateOnScroll>
                <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Training & Placements</h1>
                <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16">
                    Our dedicated placement cell works tirelessly to connect students with top companies, ensuring a bright future for our graduates.
                </p>
            </AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
                <AnimateOnScroll>
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                        <p className="text-5xl font-extrabold text-blue-600 mb-2">{collegeData.placement.highestPackage}</p>
                        <p className="text-gray-600 font-semibold">Highest Package</p>
                    </div>
                </AnimateOnScroll>
                <AnimateOnScroll>
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                        <p className="text-5xl font-extrabold text-blue-600 mb-2">{collegeData.placement.averagePackage}</p>
                        <p className="text-gray-600 font-semibold">Average Package</p>
                    </div>
                </AnimateOnScroll>
                <AnimateOnScroll>
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                        <p className="text-5xl font-extrabold text-blue-600 mb-2">{collegeData.placement.placementPercentage}%</p>
                        <p className="text-gray-600 font-semibold">Successful Placements</p>
                    </div>
                </AnimateOnScroll>
            </div>
            <AnimateOnScroll>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Esteemed Recruiters</h2>
                <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
                    {collegeData.placement.topRecruiters.map((recruiter, index) => (
                        <img key={index} src={recruiter.logo} alt={recruiter.company} className="h-12 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" title={recruiter.company} />
                    ))}
                </div>
            </AnimateOnScroll>
        </div>
    </div>
);

const AdministrationPage = ({ short = false }) => (
    <div className={`container mx-auto px-4 ${short ? 'py-16' : 'py-20'}`}>
        <AnimateOnScroll>
            <h1 className={`text-4xl font-bold text-center mb-12 text-gray-800 ${short ? 'text-3xl' : ''}`}>
                Our Administration
            </h1>
        </AnimateOnScroll>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {collegeData.administration.map(person => (
                <AnimateOnScroll key={person.slno}>
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
                        <img src={`https://placehold.co/150x150/E2E8F0/475569?text=${person.name.split(' ').map(n => n[0]).join('')}`} alt={person.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200" />
                        <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                        <p className="text-blue-600 font-semibold">{person.designation}</p>
                        <p className="text-sm text-gray-500 mt-2">{person.email}</p>
                    </div>
                </AnimateOnScroll>
            ))}
        </div>
    </div>
);

const StudentLifePage = () => (
    <div className="container mx-auto px-4 py-20">
        <AnimateOnScroll>
            <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Vibrant Student Life</h1>
            <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16">
                Experience a rich and diverse campus life with state-of-the-art facilities, clubs, and events that foster growth beyond academics.
            </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collegeData.gallery.map((image, index) => (
                <AnimateOnScroll key={index}>
                    <div className="overflow-hidden rounded-lg shadow-lg">
                        <img className="h-auto w-full max-w-full object-cover hover:scale-110 transition-transform duration-500" src={image.src} alt={image.alt} />
                    </div>
                </AnimateOnScroll>
            ))}
        </div>
    </div>
);

const ContactPage = () => (
    <div className="bg-white">
        <div className="container mx-auto px-4 py-20">
            <AnimateOnScroll>
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Get In Touch</h1>
            </AnimateOnScroll>
            <div className="grid md:grid-cols-2 gap-12">
                <AnimateOnScroll>
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <input type="text" placeholder="Your Name" className="w-full p-3 border border-gray-300 rounded-lg" />
                            <input type="email" placeholder="Your Email" className="w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                        <input type="text" placeholder="Subject" className="w-full p-3 border border-gray-300 rounded-lg" />
                        <textarea placeholder="Your Message" rows="6" className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700">Send Message</button>
                    </form>
                </AnimateOnScroll>
                <AnimateOnScroll>
                    <div className="bg-gray-50 p-8 rounded-lg">
                        <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                        <address className="not-italic text-gray-600 space-y-4">
                            <p className="flex gap-4"><MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" /><span>{`${collegeData.location.address}, ${collegeData.location.city}, ${collegeData.location.state} ${collegeData.location.pincode}`}</span></p>
                            <p className="flex gap-4"><Phone className="h-6 w-6 text-blue-600 flex-shrink-0" /><a href={`tel:${collegeData.contact.phone}`} className="hover:text-blue-700">{collegeData.contact.phone}</a></p>
                            <p className="flex gap-4"><Mail className="h-6 w-6 text-blue-600 flex-shrink-0" /><a href={`mailto:${collegeData.contact.email}`} className="hover:text-blue-700">{collegeData.contact.email}</a></p>
                        </address>
                    </div>
                </AnimateOnScroll>
            </div>
        </div>
    </div>
);


// --- Main App Component (Router) ---
const Dummy = () => {
    const [page, setPage] = useState(window.location.hash.replace('#', '') || 'home');

    useEffect(() => {
        const handleHashChange = () => {
            setPage(window.location.hash.replace('#', '') || 'home');
            window.scrollTo(0, 0);
        };

        window.addEventListener('hashchange', handleHashChange);
        // Initial scroll to top
        window.scrollTo(0, 0);

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const renderPage = () => {
        switch (page) {
            case 'about':
                return <AboutPage />;
            case 'vision':
                return <VisionMissionPage />;
            case 'academics':
                return <AcademicsPage />;
            case 'placements':
                return <PlacementsPage />;
            case 'administration':
                return <AdministrationPage />;
            case 'student-life':
                return <StudentLifePage />;
            case 'contact':
                return <ContactPage />;
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="bg-gray-50">
            <Header setPage={setPage} />
            <main>
                {renderPage()}
            </main>
            <Footer setPage={setPage} />
        </div>
    );
};

export default Dummy;