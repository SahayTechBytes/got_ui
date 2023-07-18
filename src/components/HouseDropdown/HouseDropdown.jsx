import React, { useState,useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import FamilyTree from '../FamilyTree/FamilyTree';
import FavouriteCharacters from '../Favourite/FavouriteCharacters';

const HouseDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownData, setDropdownData] = useState([]);
  const [data, setData] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    if (responseData) {
      if (Array.isArray(responseData)) {
        setData(responseData);
      } else {
        setData([responseData]);
      }
    }
  }, [responseData]);

  useEffect(() => {
    const node = restructureData(data);
      setNodes(node);
      setSelectedItem(nodes);
  }, [data]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!dropdownData.length) {
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      const houseURL = 'http://localhost:8080/api/character/houses';
      const HouseResponse = await axios.get(houseURL);
      const HouseResponseData = HouseResponse.data;
      setDropdownData(HouseResponseData);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const handleItemClick = async (item) => {
    console.log("hi",item)
    const url = 'http://localhost:8080/api/character/' + item;
    console.log('urk fetching data:', url);
    try {
      const response = await axios.get(url);
      const responseData = response.data;
      setResponseData(responseData)    
      
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  }

  const restructureData = (data) => {
    const nodes = [];
    const idMap = {};

    const nodeMap = new Map();
    data.forEach(person => {
      const node = {
        id: person.id,
        pids: person.marriedEngaged.map(spouseName => {
          const spouse = data.find(p => p.characterName === spouseName);
          return spouse ? spouse.id : null;
        }),
        name: person.characterName,
        img: person.characterImageThumb,
        image: person.characterImageFull,
        spouse: person.marriedEngaged,
        siblings: person.siblings,
        killedBy: person.killedBy,
        killed: person.killed,
        parent: person.parents,
        children: person.parentOf,
        favourite: person.favourite
      };
      idMap[person.id] = node;
  
      // Get the father's ID from parentOf
      data.forEach((person) => {
        person.parentOf.forEach((childName) => {
          const child = data.find((p) => p.characterName === childName);
          if (child) {
            const childNode = idMap[child.id];
            if (childNode) {
              childNode.fid = person.id;
            }
          }
        });
      });
  
      nodes.push(node);
      nodeMap.set(node.id, node);
    });
  
    nodes.forEach(node => {
      node.pids = node.pids.map(pid => nodeMap.has(pid) ? pid : null);
    });
  
    return nodes;
  };
 
  return (
    <div>
    <Dropdown isOpen={isOpen} toggle={toggleDropdown}>
      <DropdownToggle caret>
        Select an option
      </DropdownToggle>
      <DropdownMenu>
        {dropdownData.map((item, index) => (
          <DropdownItem key={index} onClick={() => handleItemClick(item)}>{item}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
    {selectedItem &&  nodes.length > 0 && (
        <FamilyTree key={selectedItem} nodes={nodes} />
      )}   
    {selectedItem &&  nodes.length > 0 && (
        <FavouriteCharacters />
      )}   
    </div>
  );
};

export default HouseDropdown;
