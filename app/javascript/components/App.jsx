import React from 'react'
import { useState } from 'react'
import ErrorAlert from './ErrorAlert'
import SuccessAlert from './SuccessAlert'

const App = () => {
  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/v1' : ''
  const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const successMessage = `Congratulations ${name}, you have successfully signed up for KeepSight. You will be receving reminder messages soon.`;

  const [phase, setPhase] = useState(1);
  const [veriCode, setVeriCode] = useState(-1);
  const [userVeriCode, setUserVeriCode] = useState(-10);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [error, setError] = useState(null);
  
  const reformatNumberTwilio = (num) => {
    return '+1' + num.replace(/\D/g, "")
  }

  const onResetClick = () => {
    setPhase(1);
    setError(null);
  }

  const onVerifyNumberClick = async () => {
    if (!number.match(phoneno)){
      setError(["Invalid Phone number format", "Acceptable formats: XXX-XXX-XXXX, XXX XXX XXXX, XXX.XXX.XXXX"]);
      return;
    }

    const data = JSON.stringify({ user: {number: reformatNumberTwilio(number)}})
    const res = await fetch(baseUrl + '/verify', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });

    const { code } = await res.json();
    if(res.status === 200){
      setPhase(2);
      setVeriCode(parseInt(code));
      setError(null);
    }
    else {
      setError(["Oops Something went wrong"]);
    }
  }

  const onCheckClick = () => {
    if(parseInt(userVeriCode) === veriCode){
      setPhase(3)
      setError(null);
    }
    else {
      setError(["Invalid Code", "Check Text Message Again"]);
    }
  }

  const onSignUpClick = async () => {
    if (name === ""){
      setError(["Name cannot be empty"]);
      return
    }

    const data = JSON.stringify({ user: {number: reformatNumberTwilio(number), name: name}})
    const res = await fetch(baseUrl + '/users', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });

    const info = await res.json();

    if(res.status === 201){
      setPhase(4);
      setError(null);
    }
    else {
      const { errors } = info;
      setError(errors);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pt-10 bg-gray-900 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden min-h-screen">
        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:px-0 lg:text-left lg:flex lg:items-center">
          <div className="lg:py-24">
            <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
              <span className="block">Keep</span>
              <span className="block text-indigo-400">Sight</span>
            </h1>
            <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">A great way to save your eyes. Get text reminders during your busy workday to take a break and look outside.</p>
            <div className="pt-10 flex-1">
              {error && <ErrorAlert errors={error}/>}
              {phase === 4 && <SuccessAlert message={successMessage}/>}
              {phase === 1 && 
                <div>
                  <div className='pb-5'>
                    <label htmlFor="phone-number" className="block text-sm font-medium text-gray-300">
                      Phone Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <label htmlFor="country" className="sr-only">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          autoComplete="country"
                          className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-1 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                        >
                          <option>US</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        name="number"
                        id="number"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block h-8 w-56 pl-16 sm:text-sm border-gray-300 rounded-md"
                        placeholder="555-987-6543"
                        onChange={(e) => setNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <button onClick={onVerifyNumberClick} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-400 hover:bg-gray-700">Verify Number</button>
                </div>
              }

              {phase === 2 &&
                <div>
                  <div className='pb-5'>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Enter Code Sent to Phone 
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="code"
                        id="code"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-3 block h-8 w-48 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Ex: 128572"
                        onChange={(e)=>setUserVeriCode(e.target.value)}
                      />
                    </div>
                  </div> 
                  <button onClick={onCheckClick} className="inline-flex items-center mr-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-400 hover:bg-gray-700">Check Code</button>
                  <button onClick={onResetClick} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-400 hover:bg-gray-700">Send Another Code</button>
                </div>
              }

              {phase === 3 &&
                <div>
                  <div className='pb-5'>
                    <label htmlFor="phone-number" className="block text-sm font-medium text-gray-300 pb-2">
                      Phone Number to sign up: {number}
                    </label>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Name 
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-3 block h-8 w-48 sm:text-sm border-gray-300 rounded-md"
                        placeholder='Ex: Charles'
                        onChange={(e)=>setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <button onClick={onSignUpClick} className="inline-flex items-center mr-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-400 hover:bg-gray-700">Sign Up</button>
                  <button onClick={onResetClick} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-400 hover:bg-gray-700">Restart Sign Up</button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App