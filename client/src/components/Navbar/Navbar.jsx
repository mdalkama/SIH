import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getRoleDisplayName from "../../utils/roleUtils.js"
import menuConfig from "../../utils/menuConfigUtils.js";
import StudentDashboard from "./components/StudentDashboard.jsx";
import {
    Menu,
    X,
    Home,
    Folder,
    Users,
    Settings,
    Bell,
    Search,
    User,
    ChevronDown,
    Shield,
    Plus,
    Filter,
    MoreHorizontal,
    LogOut,
    BookOpen,
    ClipboardList,
    GraduationCap,
    Wallet,
    Building2,
    Library,
} from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [user, setUser] = useState(null);
    const role = "student";

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    "https://sih-4ptm.onrender.com/api/v1/my-profile",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const data = await res.json();
                if (data) {
                    setUser(data.user);
                    console.log(data.user);
                }
            } catch (err) {
                console.error("Error fetching logged-in user:", err);
            } finally {
                console.log("final");
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch("https://sih-4ptm.onrender.com/api/v1/logout", {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                setUser(null);
                navigate("/login"); // Redirect back to login
            } else {
                console.error("Failed to logout");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const navigationItems = menuConfig[role] || [];

    return (
        <div className="h-screen w-screen bg-[#F0F1F3] overflow-hidden flex gap-2 p-0 md:p-2">
            <div className="h-full shrink-0 w-[250px] hidden rounded-lg overflow-hidden md:flex md:w-[250px] flex-col gap-4 justify-between shadow-md bg-[#0C1526] border-r-[1px] border-gray-300">
                <div className="flex flex-col gap-2 m-4">
                    <div className="w-full text-white flex text-xl items-center mb-4 justify-start">
                        <div className="flex items-start gap-2">
                            <div className="h-10 w-10 bg-[#D1D5DA] text-[#6A7280] rounded-full flex items-center justify-center">
                                <User />
                            </div>

                            <div className="md:flex hidden flex-col h-10 items-start justify-center">
                                <div className="text-[#ffffff] font-medium text-nowrap text-[14px]">
                                    {user?.name || "Md Alkama"}
                                </div>
                                <div className="text-[Grey] font-medium text-[14px]">
                                    {getRoleDisplayName(user?.role) || "Student"}
                                </div>
                            </div>

                            <div className="h-10 w-10 rounded-full md:hidden flex items-center justify-center">
                                <Menu />
                            </div>
                        </div>
                    </div>
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveMenu(item.id)}
                                className={`w-full cursor-pointer flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors
                                    ${activeMenu === item.id
                                        ? "bg-[#2B386A] text-[#DEE1E5]"
                                        : "text-[#DEE1E5] hover:bg-[#2B386A] hover:text-[#DEE1E5]"
                                    }`}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
                <div className="flex flex-col justify-between gap-4 bg-[#1D2646] h-[120px] p-4">
                    <button
                        onClick={handleLogout}
                        className="flex px-3 py-2 text-sm cursor-pointer text-[#DEE1E5] font-medium rounded-md justify-center items-center border-1 gap-2"
                    >
                        Logout <LogOut className="h-3 w-3" />
                    </button>
                    <div className="flex justify-center items-center">
                        <img
                            className="w-[80%]"
                            src="https://mybillbook.in/app//assets/images/secure-safe-v2.svg"
                            alt=""
                        />
                    </div>
                </div>
            </div>

            <div className="h-full w-[100%] bg-white shadow-md rounded-lg overflow-hidden  sm::w-full flex flex-col">
                {/* nav bar  */}
                <nav className="flex h-[80px] bg-[#FFFFFF]  z-5 justify-between items-center px-4 sm:px-8 border-b-[1px] border-gray-300">
                    <div className="flex items-center">
                        <img
                            className="h-[50px]"
                            src="https://svumshow.com/assets/images/department-logo/pngwing.png"
                            alt=""
                        />
                        <div className="hidden sm:flex flex-col text-[#0F172A] font-medium text-[14px] ml-4">
                            <div>Goverment Of Rajasthan</div>
                            <div>Department of Technical Education</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <div className="h-10 w-10 bg-[#D1D5DA] md:hidden text-[#6A7280] rounded-full flex items-center justify-center">
                            <User />
                        </div>
                        <div className="h-10 w-10 rounded-full md:hidden flex items-center justify-center">
                            <Menu />
                        </div>
                    </div>
                </nav>


                {/* component will render */}
                <div className="h-[calc(100vh-80px)] w-full overflow-y-scroll bg-white p-6">
                    <StudentDashboard />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
