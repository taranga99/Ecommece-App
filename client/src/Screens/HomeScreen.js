import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import logger from "use-reducer-logger";
import Product from "./components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "./components/LoadingBox";
import MessageBox from "./components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, productData: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, error, productData }, dispatch] = useReducer(
    logger(reducer),
    {
      productData: [],
      loading: true,
      error: "",
    }
  );

  // const [productData, setProductData] = useState([]);

  const FetchData = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const result = await axios.get("/api/products");
      dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      // setProductData(result.data);
      console.log(result.data);
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: err.message });
      console.log(err);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured Products</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : productData ? (
        <div className="products">
          <Row>
            {productData.map((product) => (
              <Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
                <Product product={product} className="product" />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div>There are no products</div>
      )}
    </div>
  );
};

export default HomeScreen;
