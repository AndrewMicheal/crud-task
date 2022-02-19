import { IonBackButton, IonButton, IonButtons, useIonAlert,  useIonModal ,useIonToast , IonCheckbox, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonTitle, IonToolbar, IonModal } from '@ionic/react';
import { useState , useEffect } from 'react';
import './Home.css';
import axios from "axios";
import { useIsMounted } from './useIsMounted';
import {trashOutline , addOutline , createOutline} from 'ionicons/icons';
import AddNote from './Components/AddNote/AddNote';
import { Storage } from '@capacitor/storage';
import { useHistory } from 'react-router';

const Home: React.FC = () => {
  const [allNotes , setAllNotes] = useState([]);
  const isMounted = useIsMounted();
  const [checked , setChecked] = useState([]);
  const history = useHistory();
  const [alertPresent] = useIonAlert();
  const [present, dismiss] = useIonToast();

  function goToAddNote() {
    history.push("/addNote")
  }

  function goToEditNote(id:any) {
    history.push(`/editNote/${id}`)
  }

 

  async function getAllData() {
    let {data}:any = await axios.get("http://localhost:3000/getAllNotes");
    if(isMounted.current) {
      setAllNotes(data.data)
    } else {
      console.log("no")
    }
  }
  
  useEffect(() => {
    getAllData();
  },[allNotes]);

  useEffect(()=> {
    getAllStorageData();
  },[])

  async function getAllStorageData() {
    const { value }:any = await Storage.get({ key: 'note' });
    if(JSON.parse(value) === null) {
      setChecked([]);
    } else {
      setChecked(JSON.parse(value));
    }
  }

  async function isChecked(e:any) {
    let arrNumbers:any = [...checked , e.target.value];
    if(e.target.checked) {
      setStorage(arrNumbers)
    } else {
      removeNote(e.target.value);
    }
  }

  async function removeNote(noteId:any) {
    const { value }:any = await Storage.get({ key: 'note' });
      let arrData = JSON.parse(value);
      let index = arrData.indexOf(noteId);
      arrData.splice(index , 1);
      setStorage(arrData);
  }

  const setStorage = async (storage: any) => {
    setChecked(storage)  
    await Storage.set({
      key: 'note',
      value: JSON.stringify(storage),
    });
  };


  function deleteMsg(noteId:any) {
    alertPresent({
      cssClass: 'my-css',
      header: 'Confirm Delete',
      message: 'Are you sure for deleting',
      buttons: [
        'Cancel',
        { text: 'Ok', handler: (d) => deleteNote(noteId) },
      ],
      onDidDismiss: (e) => console.log('did dismiss'),
    })
  }

  function showMessage(msg:any) {
    present(`${msg}`, 500)
  }

  async function deleteNote(noteId:any) {
    console.log(noteId)
    let {data} = await axios.delete(`http://localhost:3000/deleteNote/${noteId}`);
    if(data.message === "deleted") {
      showMessage(data.message);
      getAllData();
      removeNote(noteId);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className = "toolbarTitle">Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      {allNotes.length !== 0 ? <IonRow className = "mt-3">
        {allNotes.map((note:any,index:any)=> {
          return(
          <IonCol key = {index} sizeXl = "4" sizeLg = "4" sizeMd = "6" sizeSm = "12" sizeXs = "12">
            <div className="home-item">
              <div className="parent">
                <div>
                  <IonCheckbox checked= {checked.find((checkNote)=> checkNote === note.id)?true : false} value = {note.id} onClick = {isChecked} className = "checkbox"/>
                </div>
                <div className = "item-title-content">
                  <span className = "item-title">{checked.find((checkNote)=> checkNote === note.id)?<del>{note.title}</del>:note.title}</span>
                </div>
                <div>
                <IonButtons className = "btns">
                  <IonButton onClick = {()=>goToEditNote(note.id)}>
                      <IonIcon color = "success" icon = {createOutline}/>
                    </IonButton>
                    <IonButton onClick = {()=>deleteMsg(note.id)}>
                      <IonIcon color = "danger" icon = {trashOutline}/>
                    </IonButton>
                  </IonButtons>
                </div>
              </div>
              <div>
                <p>{checked.find((checkNote)=> checkNote === note.id)?<del>{note.note_desc}</del>:note.note_desc}</p>
              </div>
             
            </div>
          </IonCol>
          );
        })}
        </IonRow> : null}
        <IonFab onClick = {goToAddNote} vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon  icon = {addOutline}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
