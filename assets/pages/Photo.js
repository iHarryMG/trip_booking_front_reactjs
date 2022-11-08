import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleCustomUKModal } from '../main/App';
import { NavContext } from '../main/Context';

const Photo = () => {

    const navigate = useNavigate();
    const { photo_param, upload_success } = useParams();
    const [resultItems, setResultItems] = useState([]);
    const [personCount, setPersonCount] = useState([]);
    const [imageSelected, setImageSelected] = useState([]);
    const { setNavIDs } = useContext(NavContext);
    let photo_count = 0 ;
    let person_count = 0;

    useEffect( () => {
        const data = JSON.parse(photo_param);
        setResultItems(data);
        person_count = parseInt(data.adult_count) + parseInt(data.children_count);
        setPersonCount(person_count);
    }, []);

    const handleFormSubmit = async () => {
      try{

        let pass = null;
        let remainingPhotoCount = 0;
        for(let i=0; i < personCount; i++){
          if ($('#passport_photo_'+(i+1)).get(0).files.length === 0){
              pass = false;
              remainingPhotoCount = personCount-i;
              break;
          }else{
              pass = true;
          }
        }
        
        if(pass === true){
          handleCustomUKModal("close");
          UIkit.modal("#loading_cover").show();

          const formData = new FormData();
          formData.append("params", photo_param);
          formData.append("trip_id", resultItems.trip_id);
          formData.append("adult_count", resultItems.adult_count);
          formData.append("children_count", resultItems.children_count);
          formData.append("children_age", resultItems.children_age);
          formData.append("hotel_id", resultItems.hotel_id);
          formData.append("is_special", resultItems.is_special);
          formData.append("person_count", personCount);
          formData.append("photo_count", photo_count);
          for( let i=0; i < imageSelected.length; i++){
            formData.append("passport_photo_"+(i+1), imageSelected[i]);
          }

          await axios.post('/upload/photo', formData).then((res) => {
            UIkit.modal("#loading_cover").hide();
            
            if(res.status === 200 && res.data.upload_success == true){
              handleSetNavID(JSON.stringify(res.data));
              navigate(`/confirm/${JSON.stringify(res.data)}`);
            }else{
              handleCustomUKModal("open", "Couldn't upload passport photos. <br/>Please try again. Status code: "+res.status+", Error message: "+res.statusText);
            }
          }); 

        }else{
          handleCustomUKModal("open", "Not enough passport photos. <br/>Please submit "+remainingPhotoCount+" more person's passport photos.");
        }


      }catch(e){
        console.log("Error on uploading photos:: ");
        console.log(e);
        handleCustomUKModal("open", "Couldn't upload passport photos. <br/>Please try again.");
      }
    }

    const handleSetNavID = (confirm_param) => {
        setNavIDs(prev  => ({
            ...prev,
            confirm_param: confirm_param
        }));
    }

    function setSelectedImages (e){
      setImageSelected(current => [...current, e.target.files[0]]);
    }

    const passportMainPhotoComponent = (personCount) => {
      const photoItems = [];

      for( let i=1; i <= personCount; i++){
        photo_count = photo_count + 1;
        photoItems.push(
          <tr key={i}>
            <td style={{width:"15%"}}>No {i}</td>
            <td style={{width:"85%"}}>
                <div className="uk-margin" data-uk-margin="">
                    <div uk-form-custom="target: true" className="uk-form-custom uk-first-column">
                        <input 
                          type="file" 
                          id={'passport_photo_'+i} 
                          name={'passport_photo_'+i} 
                          accept="image/*" 
                          capture="camera" 
                          onChange={(event) => {
                            setSelectedImages(event);
                          }}
                        />
                        <input className="uk-input uk-form-width-medium" type="text" placeholder="Choose photo" />
                    </div>
                </div>
            </td>
          </tr>
        )
      }
      return photoItems;
    }

    const passportSubPhotoComponent = (personCount) => {
      const photoItems = [];

      for( let i=(personCount+1); i <= (personCount*2); i++){
        photo_count = photo_count + 1;
        photoItems.push(
          <tr key={i}>
              <td style={{width:"15%"}}>No {i} </td>
              <td style={{width:"85%"}}>
                  <div className="uk-margin" data-uk-margin="">
                      <div uk-form-custom="target: true" className="uk-form-custom uk-first-column">
                          <input 
                              type="file" 
                              id={'passport_photo_'+i} 
                              name={'passport_photo_'+i} 
                              accept="image/*" 
                              capture="camera" 
                              onChange={(event) => {
                                setSelectedImages(event);
                              }}
                            />
                          <input className="uk-input uk-form-width-medium" type="text" placeholder="Choose photo" />
                      </div>
                  </div>
              </td>
          </tr>
        )
      }
      return photoItems;
    }

    return (
      <>
        <div className="jumbotron col-12 col-md-12 photo-item" style={{ paddingBottom: "0 !important" }}>
            <p><span uk-icon="info"></span> You must submit passport photos for all travelers to make a booking.</p>
        </div>
        <div className="jumbotron col-12 col-md-12 photo-item" style={{ paddingBottom: "0 !important" }}>
            <p><span uk-icon="image"></span> Valid file types (JPG,JPEG,PNG)</p>
        </div>

        { !upload_success &&
          <form id="form_passport_photo" name="form_passport_photo">
              <div className="jumbotron col-12 col-md-12 photo-item">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ color: "#0000c9", fontWeight: "normal"}} colSpan="2">
                            Main page of the passport /Mandatory/
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      { passportMainPhotoComponent(personCount) }
                    </tbody>
                  </table>
              </div>
              <div className="jumbotron col-12 col-md-12 photo-item">        
                  <table>
                    <thead>
                      <tr>
                        <th style={{color: "#333", fontWeight: "normal"}} colSpan="2">
                          If your passport has been extended, please include a photo of the extension page.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      { passportSubPhotoComponent(personCount) }
                    </tbody>
                  </table>
              </div>    
              <div className="jumbotron col-12 col-md-12">  
                  <a onClick={handleFormSubmit} id="photo_upload" name="photo_upload" className="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">
                    Submit
                  </a>
              </div>
          </form>
        }

      </>
    )
}

export default Photo