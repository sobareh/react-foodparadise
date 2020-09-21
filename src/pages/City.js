import React, { useState, useEffect } from "react";

import axios from "axios";
import { API } from "../config/api";
import CategoryList from "../components/CategoryList";
import SearchKeyword from "../components/SearchKeyword";
import SearchCriteria from "../components/SearchCriteria";
import RestaurantCard from "../components/RestaurantCard";

const City = (props) => {
  const [city, setCity] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categorySelected, setCategorySelected] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // cara mendapatkan parameter city_id dari url / route
    let { city_id } = props.match.params;
    getCityData(city_id);

    getCategoriesData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCityData = (city_id) => {
    let url = `${API.zomato.baseUrl}/cities`;
    axios
      .get(url, {
        headers: {
          "user-key": API.zomato.api_key,
        },
        params: {
          city_ids: `${city_id}`,
        },
      })
      .then(({ data }) => {
        let city = data.location_suggestions[0];
        let newCriteria = {
          criteriaName: "City",
          data: city,
        };
        let criteria2 = [...criteria];
        criteria.push(newCriteria);
        setCity(city);
        setCriteria(criteria2);
      })
      .catch((err) => console.log(err));
  };

  const getCategoriesData = () => {
    let url = `${API.zomato.baseUrl}/categories`;
    axios
      .get(url, {
        headers: {
          "user-key": API.zomato.api_key,
        },
      })
      .then(({ data }) => {
        // proses transform data categories
        let categories = transformCategoriesData(data.categories);
        setCategories(categories);
      })
      .catch((err) => console.log(err));
  };

  const transformCategoriesData = (categories) => {
    let categoriesTransformed = categories.map((category) => {
      return category.categories;
    });

    return categoriesTransformed;
  };

  const categoryClickHandler = (category) => {
    let criteria2 = [...criteria];
    // ambil element array selain element dengan criteriaName 'Category'
    criteria2 = criteria.filter((cri) => cri.criteriaName !== "Category");
    let newCriteria = {
      criteriaName: "Category",
      data: category,
    };
    criteria.push(newCriteria);
    setCategorySelected(category, criteria2);
  };

  const changeKeywordHandler = (event) => {
    setKeyword(event.target.value);
  };

  const addToCriteriaHandler = () => {
    let criteria2 = [...criteria];
    criteria2 = criteria2.filter((cri) => cri.criteriaName !== "Keyword");
    let newCriteria = {
      criteriaName: "Keyword",
      data: {
        name: keyword,
      },
    };

    criteria2.push(newCriteria);
    setKeyword("");
    setCriteria(criteria2);
  };

  const removeCriteriaHandler = (index) => {
    let criteria2 = [...criteria];
    criteria2.splice(index, 1);
    setCriteria(criteria2);
    console.log(criteria2);
  };

  const searchHandler = () => {
    setRestaurants(null);
    let url = `${API.zomato.baseUrl}/search`;
    let params = {};

    for (let cri of criteria) {
      switch (cri.criteriaName) {
        case "City":
          params.entity_id = cri.data.id;
          params.entity_type = "city";
          break;
        case "Category":
          params.category = cri.data.id;
          break;
        case "Keyword":
          params.q = cri.data.name;
          break;
        default:
          break;
      }
    }

    axios
      .get(url, {
        headers: {
          "user-key": API.zomato.api_key,
        },
        params,
      })
      .then(({ data }) => {
        setRestaurants(data.restaurants);
      })
      .catch((err) => console.log(err));
  };

  const renderRestaurantList = () => {
    if (restaurants == null) {
      return (
        <div className="col">
          <p>Loading...</p>
        </div>
      );
    }

    if (restaurants.length > 0) {
      return restaurants.map(({ restaurant }) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ));
    } else {
      return (
        <div className="col">
          <p>No Data available. Please select criteria, and click Search</p>
        </div>
      );
    }
  };

  return (
    <div
      className="container-fluid"
      style={{ marginTop: 30, marginBottom: 30 }}
    >
      {city && (
        <div className="row">
          <div className="col">
            <h4 className="text-success">
              Restaurant in {city.name}, {city.country_name}
            </h4>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-3">
          <h5>Categories</h5>
          <CategoryList
            categories={categories}
            categorySelected={categorySelected}
            categoryClickHandler={(category) => categoryClickHandler(category)}
          />
        </div>

        <div className="col">
          <SearchKeyword
            keyword={keyword}
            changeKeywordHandler={changeKeywordHandler}
            onClickAddToCriteria={addToCriteriaHandler}
          />
          <SearchCriteria
            criteria={criteria}
            removeCriteriaHandler={(index) => removeCriteriaHandler(index)}
            onClickSearch={searchHandler}
          />

          <div className="row">
            <div className="col" style={{ marginBottom: 10 }}>
              <h4 className="text-success">Restaurant List</h4>
            </div>
          </div>
          <div className="row">{renderRestaurantList()}</div>
        </div>
      </div>
    </div>
  );
};

export default City;
