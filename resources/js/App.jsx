import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import Articles from './Articles'
import Fournisseurs from './Fournisseurs'

export default function App() {
    const [darkMode, setDarkMode] = useState(true)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />} />
                <Route path="/articles" element={<Articles darkMode={darkMode} setDarkMode={setDarkMode} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />} />
                <Route path="/fournisseurs" element={<Fournisseurs darkMode={darkMode} setDarkMode={setDarkMode} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />} />
            </Routes>
        </BrowserRouter>
    )
}
