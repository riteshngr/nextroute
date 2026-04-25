import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'


import Home from './pages/home'
import About from './pages/about'
import Contact from './pages/contact'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          
        
          <Route index element={<Home />} />
          
          
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
  
          
          
          <Route path="*" element={<div style={{padding: '50px', textAlign: 'center'}}><h1>404</h1><p>Page Not Found</p></div>} />
        
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App