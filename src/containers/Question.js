import React, { useState, useEffect } from "react";
import Card from "../components/Card/Card";
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import Helmet from 'react-helmet';

const QuestionWrapper = styled.div`
 display: flex;
 justify-content: space-between;
 flex-direction: column;
 margin: 5%;
`;
const Alert = styled.div`
 text-align: center;
`;

const ROOT_API = 'https://api.stackexchange.com/2.2/';

const Question = () => {
    let params = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')

    useEffect(() => {
        try {
            const fetchData = async () => {
                const data = await fetch(`${ROOT_API}questions/${params.id}?site=stackoverflow`);
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

    },
        [params.id])

    if (loading || error) {
        return (
            <>
                <Helmet>
                    <title>{`Q&A Feed - Question#${params.id}`}</title>
                </Helmet>
                <Alert>{loading ? 'Loading...' : error}</Alert>
            </>
        )
    }

    return (
        <QuestionWrapper>
            <Card key={data.items[0].question_id} data={data.items[0]} />
        </QuestionWrapper>
    )
}
export default Question;