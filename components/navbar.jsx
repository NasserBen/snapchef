"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SignInButton from "./signInButton";
import SnapChefLogo from "../assets/LogoDesign1.svg";
import Search from "../assets/icons/Search.svg";
import Home from "../assets/icons/home.svg";
import HomeFill from "../assets/icons/homefill.svg";
import Bell from "../assets/icons/bell.svg";
import BellFill from "../assets/icons/bellfill.svg";
import Post from "../assets/icons/post.svg";
import PostFill from "../assets/icons/postfill.svg";
import Fav from "../assets/icons/favorites.svg";
import FavFill from "../assets/icons/favoritesfill.svg";
import Profile from "../assets/icons/Profile.svg";
import ProfileFill from "../assets/icons/profilefill.svg";

import Notifications from "./notifications";

import { useSession } from "next-auth/react";

function Navbar() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState("");
  const [showNotifications, setShowNotifications] = useState(false); // State to control the visibility of Notifications component
  const [searchTerm, setSearchTerm] = useState("");

  const { data: session } = useSession();

  const handleBellClick = () => {
    setShowNotifications(!showNotifications); // Toggle the visibility of Notifications component
  };

  useEffect(() => {
    // Update active path whenever the route changes
    setActivePath(pathname);
  }, [pathname]);

  const isLinkActive = (path) => path === activePath;

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/search/${searchTerm}`;
    //setSearchTerm("");
  };

  return (
    <nav className="flex items-center justify-between p-4 relative mr-2">
      {/* Use the larger SnapChef.svg logo */}
      <Link href="/">
        <Image
          src={SnapChefLogo}
          alt="SnapChefLogo"
          className="cursor-pointer"
          width={300}
          height={300}
          style={{ position: "relative", top: "0px" }} // Adjust the top value
        />
      </Link>
      {/* Display only the search field on the home and search page */}
      { (pathname === '/home' || pathname.startsWith('/search/')) && (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center flex-shrink-0 w-50 px-2 relative">
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-2 py-1 border-2 border-gray-300 rounded pl-8"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Image src={Search} alt="Search" width={20} height={20} />
            </div>
          </div>
        </form>
      )}
      {session ? (
        <ul className="flex gap-8 list-none">
          <Link href="/home">
            <Image
              src={isLinkActive("/home") ? HomeFill : Home}
              alt="Home"
              className="nav-icon cursor-pointer"
              width={40}
              height={40}
            />
          </Link>
          <div className="nav-icon cursor-pointer" onClick={handleBellClick}>
            <Image
              src={showNotifications ? BellFill : Bell}
              alt="Bell"
              width={40}
              height={40}
            />
          </div>
          <Link href="/create">
            <Image
              src={isLinkActive("/create") ? PostFill : Post}
              alt="Post"
              className="nav-icon cursor-pointer"
              width={40}
              height={40}
            />
          </Link>
          <Link href="/favorites">
            <Image
              src={isLinkActive("/favorites") ? FavFill : Fav}
              alt="Home"
              className="nav-icon cursor-pointer"
              width={40}
              height={40}
            />
          </Link>
          <Link href={`/profile/${session?.user?.name}`}>
            <Image
              src={isLinkActive("/profile") ? ProfileFill : Profile}
              alt="Home"
              className="nav-icon cursor-pointer"
              width={40}
              height={40}
            />
          </Link>
        </ul>
      ) : (
        <SignInButton />
      )}
      {showNotifications && (
        <Notifications setShowNotifications={setShowNotifications} />
      )}
    </nav>
  );
}

export default Navbar;