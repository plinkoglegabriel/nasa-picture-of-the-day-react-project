import Footer from "./components/Footer"
import Main from "./components/Main"
import SideBar from "./components/SideBar"
import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  function handleToggleModal() {
    setShowModal(!showModal)
  }

  useEffect(() => {
    async function fetchData() {
      const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY
      const today = (new Date()).toDateString()
      const localKey = `NASA-${today}`
      if (localStorage.getItem(localKey)) {
        const apiData = JSON.parse(localStorage.getItem(localKey))
        setData(apiData)
        console.log("Fetched from cache today")
        return
      }
      localStorage.clear()
      try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
        const apiData = await response.json()
        localStorage.setItem(localKey, JSON.stringify(apiData))
        setData(apiData)
        console.log("Fetched from API today")
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])
  return (
    <>
      {data ? (<Main data={data} />) : (
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      )}
      {showModal && ( <SideBar data={data} handleToggleModal={handleToggleModal}/> )}
      { data && (
        <Footer data={data} showModal={showModal} handleToggleModal={handleToggleModal}/> )}
    </>
  )
}

export default App
