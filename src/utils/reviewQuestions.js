import { AiOutlineSafety } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { FaPaintRoller, FaRegLightbulb } from "react-icons/fa";
import { GiVacuumCleaner } from "react-icons/gi";
import { IoWaterOutline } from "react-icons/io5";
import { MdOutlineDoorFront, MdOutlineWash } from "react-icons/md";
import { TbHandSanitizer } from "react-icons/tb";
import { FaToiletsPortable } from "react-icons/fa6";


export const  reviewQueastions = [
    {
      label: "Cleanliness",
      category: "cleanliness",
      rating: 0,
      icon: GiVacuumCleaner,
    },
    {
      label: "Door / Door Locks / Handles",
      category: "toilet_door",
      rating: 0,
      icon: MdOutlineDoorFront,
    },
    {
      label: "Water supply - Tap / Flush",
      category: "water_for_flush",
      rating: 0,
      icon: IoWaterOutline,
    },
    {
      label: "Washbasin",
      category: "washbasin",
      rating: 0,
      icon: MdOutlineWash,
    },
    {
      label: "Handwash",
      category: "hadwash",
      rating: 0,
      icon: TbHandSanitizer,
    },
    { label: "Light", category: "light", rating: 0, icon: FaRegLightbulb },
    {
      label: "Painting",
      category: "painting",
      rating: 0,
      icon: FaPaintRoller,
    },
    {
      label: "Infrastructure / Tiles",
      category: "infrastructure",
      rating: 0,
      icon: FaToiletsPortable,
    },
    { label: "Overall", category: "overall", rating: 0, icon: CiStar },
    {
      label: "Comment",
      category: "comment",
      rating: '',
    },
  ]