import React, { Component } from "react";
import FamilyTree from "@balkangraph/familytree.js";
import axios from "axios";


export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
    this.family=null;
  }

  favourite = '<svg width="24" height="24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 107.39"><defs><style>.cls-1{fill:#ffff;fill-rule:evenodd;}</style></defs><title>red-heart</title><path id="red_heart_fav" class="red_heart_fav" d="M60.83,17.18c8-8.35,13.62-15.57,26-17C110-2.46,131.27,21.26,119.57,44.61c-3.33,6.65-10.11,14.56-17.61,22.32-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.55C29.16,76.89,1,55.92,0,29.94-.63,11.74,13.73.08,30.25.29c14.76.2,21,7.54,30.58,16.89Z"/></svg>';

  componentDidMount() {
    this.family = new FamilyTree(this.divRef.current, {
      nodes: this.props.nodes,
      scaleInitial: FamilyTree.match.height,
      miniMap: true,
      subtreeSeparation: 20,
      mode: "dark",
      nodeBinding: {
        field_0: "name",
        img_0: "img"
      },
      editForm: {
        readOnly: !1,
        titleBinding: "name",
        photoBinding: "image",
        generateElementsFromFields: false,
        elements: [
          [
            { type: "textbox", label: "Name", binding: "name" },
            { type: "textbox", label: "Spouse", binding: "spouse" },
          ],
            { type: "textbox", label: "Parent", binding: "parent" },
            { type: "textbox", label: "Killed By", binding: "killedBy" },
          
          { type: "textbox", label: "Siblings", binding: "siblings" },
          { type: "textbox", label: "Children", binding: "children" },
        ],
        buttons: {
          edit: null,
          share: null,
          pdf: null,
          map: {
            icon : this.favourite,
            text : Map + "id"
          },
        },
      },
    });

    this.family.on('click', function(props,args){
      console.log('document-->',document);
      props.manager.config.nodes.forEach(element => {
        if(element.id == args.node.id){
          const redHearElement = document.getElementsByClassName("red_heart_fav");
          if(element.favourite == false){
            if (redHearElement.length > 0) {
              const firstElement = redHearElement[0];
              firstElement.classList.add("fav");
              firstElement.classList.remove("not_fav");
            }
          }else{
            if (redHearElement.length > 0) {
              const firstElement = redHearElement[0];
              firstElement.classList.add("not_fav");
              firstElement.classList.remove("fav");
            }
          }
        }
      });
    })

    this.family.editUI.on('button-click', async function(menu, args){
      if (args.name == 'map') {
      const svgElement = document.getElementById("red_heart_fav");
      console.log("conatins", svgElement.classList);
      try {
        const id = args.nodeId;
        const targetUrl = `http://localhost:8080/api/character/${id}/favourite`;
        await axios.put(targetUrl);
        
      } catch (error) {
        console.error("Error sending PUT request:", error);
      }
      if (svgElement.classList.contains("fav")) {
        svgElement.classList.add("not_fav");
        svgElement.classList.remove("fav");
        menu.obj.config.nodes.forEach(element => {
          if(element.id = args.nodeId){
            element.favourite = false;
          }
        })
      } else if(svgElement.classList.contains("not_fav")){
        svgElement.classList.add("fav");
        svgElement.classList.remove("not_fav");
        menu.obj.config.nodes.forEach(element => {
          if(element.id = args.nodeId){
            element.favourite = true;
          }
        })
      } else{
        svgElement.classList.add("fav");
        svgElement.classList.remove("not_fav");
        menu.obj.config.nodes.forEach(element => {
          if(element.id = args.nodeId){
            element.favourite = false;
          }
        })
      }
    }
    } )
  }

  render() {
    return <div id="tree" ref={this.divRef}></div>;
  }
}
