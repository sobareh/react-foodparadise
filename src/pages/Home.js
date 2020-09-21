import React, { useEffect, useState } from "react";
import ImageAndWelcome from "../components/ImageAnWelcome";
import CityList from "../components/CityList";
import SearchCity from "../components/SearchCity";
import axios from "axios";
import { API } from "../config/api";

const Home = () => {
  const [featuredCities, setFeaturedCities] = useState(null);
  const [citiesResultSearch, setCitiesResultSearch] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [cityKeywordSearch, setCityKeywordSearch] = useState("");

  useEffect(() => {
    const getFeaturedCities = () => {
      var url = `${API.zomato.baseUrl}/cities`;
      axios
        .get(url, {
          headers: {
            "user-key": API.zomato.api_key,
          },
          params: {
            city_ids: "74,11052,170",
          },
        })
        .then(({ data }) => {
          if (data.status === "success") {
            setFeaturedCities(data.location_suggestions);
          }
        })
        .catch((err) => console.log(err));
    };
    getFeaturedCities();
  }, []);

  const changeKeywordHandler = (event) => {
    setKeyword(event.target.value);
  };

  const searchHandler = () => {
    var url = `${API.zomato.baseUrl}/cities`;
    axios
      .get(url, {
        headers: {
          "user-key": API.zomato.api_key,
        },
        params: {
          q: keyword,
        },
      })
      .then(({ data }) => {
        if (data.status === "success") {
          setCitiesResultSearch(data.location_suggestions);
          setKeyword("");
          setCityKeywordSearch(keyword);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <ImageAndWelcome />
      <div className="container" style={{ marginTop: 30, marginBottom: 30 }}>
        <CityList title={"Featured Cities"} cities={featuredCities} />

        <SearchCity
          value={keyword}
          onChange={changeKeywordHandler}
          onClickSearch={searchHandler}
        />

        {cityKeywordSearch !== "" && (
          <CityList
            title={"Search Result"}
            showSubtitle={true}
            subtitle={cityKeywordSearch}
            cities={citiesResultSearch}
          />
        )}
      </div>
    </>
  );
};

export default Home;
