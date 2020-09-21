import React, { useEffect, useState } from "react";
import RestaurantProfile from "../components/RestaurantProfile";
import Review from "../components/Review";

import axios from "axios";
import { API } from "../config/api";

const RestaurantDetail = (props) => {
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    let { params } = props.match;
    getRestaurantData(params.restaurant_id);
    getReviewsData(params.restaurant_id);
  }, [props.match]); // react-hooks/exhaustive-deps

  const getRestaurantData = async (restaurant_id) => {
    let url = `${API.zomato.baseUrl}/restaurant`;

    try {
      const res = await axios.get(url, {
        headers: {
          "user-key": API.zomato.api_key,
        },
        params: {
          res_id: restaurant_id,
        },
      });

      setRestaurant(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getReviewsData = (restaurant_id) => {
    let url = `${API.zomato.baseUrl}/reviews`;
    axios
      .get(url, {
        headers: {
          "user-key": API.zomato.api_key,
        },
        params: {
          res_id: restaurant_id,
        },
      })
      .then(({ data }) => {
        setReviews(data.user_reviews);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container" style={{ marginTop: 30, marginBottom: 30 }}>
      <div className="row">
        <div className="col-12" style={{ marginBottom: 20 }}>
          <RestaurantProfile restaurant={restaurant} />
        </div>

        <div className="col-12" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-body">
              <h4 className="text-success" style={{ fontWeight: 800 }}>
                Reviews
              </h4>

              {reviews ? (
                reviews.map(({ review }) => (
                  <Review key={review.id} review={review} />
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
