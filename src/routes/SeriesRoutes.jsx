import { Routes, Route } from "react-router-dom";
import { SeriesList, SeriesDetail } from "../pages";

const SeriesRoutes = ({seriesData, cardSeries}) => {
    return(
        <Routes>
            <Route element={<SeriesList seriesData={seriesData} cardSeries={cardSeries}/>} path="list" />
            <Route element={<SeriesDetail seriesData={seriesData} cardSeries={cardSeries}/>} path="detail/:id" />
        </Routes>
    )
}

export default SeriesRoutes;