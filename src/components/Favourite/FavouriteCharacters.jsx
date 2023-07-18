import './FavouriteCharacters.css';
import React, { useState } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, CardText, CardImg } from 'reactstrap';

const FavouriteCharacters = () => {
  const [characters, setCharacters] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/character/favorites"); // Replace with your API endpoint
      setCharacters(response.data);
    } catch (error) {
      console.log("Error fetching data from API:", error);
    }
  };

  fetchData();

  return (
    <div id="card_div">
    <h2 id="fav_character">Favourite Characters</h2>
    <div id="container_div">
    <div id="card_container">
    {characters.map((character) => (
      <Card key={character.characterName} id="cards">
        <CardImg top src={character.characterImageThumb} alt={character.name} className="mx-auto mt-3 card_image" />
        <CardBody>
          <CardTitle>{character.characterName}</CardTitle>
          <CardText>HouseName : {character.houseName}</CardText>
        </CardBody>
      </Card>
    ))}
  </div>
  </div>
  </div>
  );
};

export default FavouriteCharacters;
