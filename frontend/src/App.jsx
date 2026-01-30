import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import TCGdex from "@tcgdex/sdk";
import { Header, Footer } from './components';
import { CardDetail, MainPage, SearchPage, DeckMaker, CardSimulator } from './pages';
import { SeriesRoutes } from './routes';
import './App.css'

const Layout = () => {
  return (
    <div id="Layout">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

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
            <Route element={<CardSimulator /> } path='/simulator' />
            <Route element={<SearchPage /> } path='/search' />
            <Route element={<DeckMaker seriesData={seriesData} cardSeries={cardSeries} /> } path='/deckmaker' />
            <Route element={<SeriesRoutes seriesData={seriesData} cardSeries={cardSeries} />} path='/series/*' />
            <Route element={<CardDetail /> } path='card/:id' />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* {Object.entries(seriesData).map(([setId, cards]) => (
        <div key={setId}>
          <h2>{setId}</h2>
          <ul>
            {cards.map((card) => (
              <li key={card.id}>
                {card.id} — {card.name}
              </li>
            ))}
          </ul>
        </div>
      ))} */}
    </>
  )
}

export default App
