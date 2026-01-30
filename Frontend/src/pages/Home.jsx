import React from 'react'
import Uber from "../assets/Uber.png"
import logo from "../assets/Uber-logo.png"
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Home = ()=>{
    return(
        <div>
            <div className='relative flex flex-col '>
                <img src={Uber} className='h-182.5' />
                <img src={logo} className='absolute mt-5 w-1/2'/>

            </div>
            <div className='flex flex-col m-6'>
                <p className='font-bold text-2xl'>Get Started with Uber</p>
                <div className='bg-black w-full text-white py-3 px-4 mt-4 rounded-md text-xl'>
                    <Link to={"/signup"} className='flex justify-between items-center'>
                        <button className='text-2xl ml-30'>Continue</button>
                        <FaArrowRight className='color-white'/>
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default Home;