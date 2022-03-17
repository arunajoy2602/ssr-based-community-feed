import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Card from '../components/Card/Card';
import Helmet from 'react-helmet';
// import queryString from 'query-string';


const FeedWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 5%;
`;

const Alert = styled.div`
  text-align: center;
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const PaginationBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const PaginationLink = styled(Link)`
 padding: 1%;
 background: lightBlue;
 color: white;
 text-decoration: none
 border-radius: 5px;
`;



const ROOT_API = 'https://api.stackexchange.com/2.2/';

const Feed = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams,] = useSearchParams();

  // const query = queryString.parse(location.search);
  // let page = (query.page) ? parseInt(query.page) : 1;
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    try {
      const fetchData = async () => {
        const data = await fetch(`${ROOT_API}questions?order=desc&sort=activity&tagged=reactjs&site=stackoverflow&page=${page}`,);
        const dataJSON = await data.json();

        if (dataJSON) {
          setData(dataJSON);
          setLoading(false);
          console.log('success')
        }
      }
      fetchData()

    }
    catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }, [page])


  if (loading || error) {
    return (
      <>
        <Helmet>
          <title>Q&A Feed - Questions</title>
        </Helmet>
        <Alert>{loading ? 'Loading...' : error}</Alert>
      </>
    )

  }

  return (
    <FeedWrapper>
      {data.items.map(item => (
        <CardLink key={item.question_id} to={`/questions/${item.question_id}`}>
          <Card data={item} />
        </CardLink>
      ))}
      <PaginationBar>
        {page > 1 && <PaginationLink to={`${location.pathname}?page=${page
          - 1}`}>Previous</PaginationLink>}
        {data.has_more && <PaginationLink
          to={`${location.pathname}?page=${page + 1}`}>Next</PaginationLink>}
      </PaginationBar>
    </FeedWrapper>
  );
}


export default Feed;
