import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import TCGdex from "@tcgdex/sdk";
import { Header, Footer } from './components';
import { CardDetail, Login, Join, MainPage, SearchPage, DeckMaker, DeckDetail, DeckEdit, DeckRecipeBoard, Search, CardSimulator, ScrapList, MyCollection, MyDeckList } from './pages';
import { SeriesRoutes } from './routes';
import './App.css'
import axios from 'axios';

const Layout = () => {
  return (
    <div id="Layout">
      <Header />
      <main className="content-area">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// 모든 axios 요청에 세션 쿠키를 포함하도록 설정
axios.defaults.withCredentials = true;

const App = () => {
  const [cardSeries, setCardSeries] = useState({ sets: [] });
  const [seriesData, setSeriesData] = useState({}); // { A1: [...cards], A2: [...cards] }
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    const sdk = new TCGdex('en');
    try {
      const series = await sdk.fetch("series", "tcgp");
      setCardSeries(series.sets)
      const setIds = series.sets.map((s) => s.id);
      const results = {};
      for (const setId of setIds) {
        const setData = await sdk.fetch("sets", setId);
        results[setId] = setData.cards;
      }
      setSeriesData(results);
    } catch (e) {
      console.error("Error fetching tcgp:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading Pocket cards...</p>;
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />} path='/'>
            <Route element={<MainPage seriesData={seriesData} />} index />
            <Route element={<Login />} path='/login' />
            <Route element={<Join />} path='/join' />
            <Route element={<CardSimulator /> } path='/simulator' />
            <Route element={<DeckMaker seriesData={seriesData} cardSeries={cardSeries} /> } path='/deckmaker' />
            <Route element={<DeckRecipeBoard /> } path='/deckRecipes' />
            <Route element={<DeckDetail />} path='/deck/:deckId' />
            <Route element={<DeckEdit seriesData={seriesData} cardSeries={cardSeries} />} path='/deck/edit/:deckId' />
            <Route element={<SeriesRoutes seriesData={seriesData} cardSeries={cardSeries} />} path='/series/*' />
            <Route element={<Search cardSeries={cardSeries} />} path='/search' />
            <Route element={<ScrapList />} path="/mypage/scrapped-decks" />
            <Route element={<MyDeckList />} path="/mypage/my-decks" />
            <Route element={<MyCollection />} path="/my-collection" />
            <Route element={<CardDetail /> } path='card/:id' />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
