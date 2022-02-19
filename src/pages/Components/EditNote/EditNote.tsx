import { IonBackButton, IonButton, IonButtons, IonCard, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar,useIonToast } from '@ionic/react';
import axios from "axios"
import { useState , useEffect } from 'react';
import { useParams , useHistory } from 'react-router';


const EditNote: React.FC = () => {
  const params:any = useParams();
  const history = useHistory();
  const [noteTitle , setNoteTitle] = useState("");
  const [noteDesc , setNoteDesc] = useState("");
  const [present, dismiss] = useIonToast();

  useEffect(()=> {
      async function getNote(){
          let {data} = await axios.get(`http://localhost:3000/getNote/${params.id}`);
          await setNoteTitle(data.data[0].title);
          await setNoteDesc(data.data[0].note_desc);
      }
      getNote();
  },[])

  let note:any = {
      title: noteTitle ,
      note_desc: noteDesc
  }
  function getNoteData(e:any) {
      note[e.target.name] = e.target.value;
      console.log(note);
  }
  function showMessage(msg:any) {
    present(`${msg}`, 500)
  } 
  async function sendData(e:any) {
    e.preventDefault();
     
      let {data} = await axios.put(`http://localhost:3000/updateNote/${params.id}`,note);
      e.target.reset();
      if(data.message === "updated") {
        showMessage(data.message);
          history.replace("/home");
      }
  }
  return (
      
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Note</IonTitle>
          <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <form onSubmit = {sendData}>
          <IonCard className = "note-card">
              <IonItem lines = "none">
               <IonLabel>Title</IonLabel>
              <IonInput value = {noteTitle!==""?noteTitle:""} onKeyUp = {getNoteData} type = "text" className = "input" name = "title"/>
              </IonItem>
              <IonItem className = "desc-input" lines = "none">
                <IonLabel>Description</IonLabel>
                <IonInput value = {noteDesc!==""?noteDesc:""} onKeyUp = {getNoteData} type = "text" className = "input" name = "note_desc"/>
              </IonItem>
              <IonButton type = "submit" className = "mt-3 btnAdd">Edit Note</IonButton>
          </IonCard> 
       </form>
      </IonContent>
    </IonPage>
  );
};

export default EditNote;
