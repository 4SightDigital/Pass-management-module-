import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Events from './pages/Events'
import Venues from './pages/Venues'
import useVenueStore from './store/useVenueStore'

function App() {
  const myStore = useVenueStore()
  console.log(myStore)
  return (
    <>
    <BrowserRouter>
    <nav className='flex'>
      <div className='text-3xl font-bold underline p-5'>
      <Link to="/events">Events</Link>
      
      </div>
      <div className='text-3xl font-bold underline p-5'>
      <Link to="/venue">Venue</Link>
      </div>

    </nav>


    <Routes>

    <Route path='/events' element={<Events/>}> </Route>
    <Route path='/venue' element={Venues()}> </Route>
    </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
