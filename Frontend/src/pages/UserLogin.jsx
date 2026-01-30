import React, { useState } from 'react'
import uberLogo from "../assets/Uber-logo.png"
import { Link } from 'react-router-dom';

const UserLogin = ()=>{

    const [email ,setEmail] = useState('');
    const [password ,setPassword] = useState('');
    const [userData , setUserData] = useState({});

    const submitHandler = async (e)=>{
        e.preventDefault();

        setUserData({
            email:email,
            password:password
        })

        setEmail('');
        setPassword('');

    }

    return(
        <div className='flex flex-col justify-between h-screen p-8'>
            <div>
                <div className=''>
                    <img src={uberLogo} className='w-2/3 -mx-16'></img>
                </div>

                <form className='flex flex-col' onSubmit={(e)=>{submitHandler(e)}}>
                    <label htmlFor='email' className='font-semibold text-2xl mb-4'>What's your email</label>
                    <input 
                        type='email'
                        value={email}
                        id='email'
                        placeholder='email@example.com'
                        onChange={(e)=>{setEmail(e.target.value)}}
                        className='rounded-sm py-2 px-3 bg-gray-200 mb-4'
                    ></input>

                    <label htmlFor='password' className='font-semibold text-2xl mb-4'>Enter Password</label>
                    <input 
                        type='password'
                        value={password}
                        id='password'
                        placeholder='password'
                        onChange={(e)=>{setPassword(e.target.value)}}
                        className='rounded-sm py-2 px-3 bg-gray-200 mb-4'
                    ></input>

                    <button className='bg-black rounded-md mt-6 text-white text-xl font-semibold p-2'>Login</button>

                    <div className='flex justify-center mt-5'>
                        <p className='text-xl font-semibold'>New here?</p>
                        <pre>  </pre>
                        <Link to={"/signup"} className='text-xl font-semibold text-blue-500'>Create new Account</Link>
                    </div>
                </form>
            </div>

            <div className='bg-green-600 flex justify-center rounded-md mt-6 text-white text-xl font-semibold p-3 mb-6'>
                <Link to={"/captain-login"}>Sign in as Captain</Link>
            </div>

        </div>
    )
}


export default UserLogin;