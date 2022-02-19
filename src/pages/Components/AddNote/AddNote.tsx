import { IonButton, IonCard, IonButtons , IonBackButton , IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import axios from 'axios';
import "./AddNote.css";
import { useHistory } from 'react-router';

const AddNote: React.FC = (props:any) => {
    const [present, dismiss] = useIonToast();
    const history = useHistory();
    let note:any = {
        title:"" ,
        note_desc:""
    }

    function getNoteData(e:any) {
        note[e.target.name] = e.target.value;
    }
    function showMessage(msg:any) {
      present(`${msg}`, 500)
    }
    async function sendData(e:any) {
      e.preventDefault();
        let {data} = await axios.post("http://localhost:3000/addNote",note);
        e.target.reset();
        if(data.message === "added") {
          showMessage(data.message);
            history.push("/home")
        }
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className = "toolbarTitle">Add Note</IonTitle>
          <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <form onSubmit = {sendData}>
          <IonCard className = "note-card">
              <IonItem lines = "none">
                <IonInput placeholder = "Title" onKeyUp = {getNoteData} className = "input" type = "text" name = "title"/>
              </IonItem>
              <IonItem className = "desc-input" lines = "none">
                  <IonInput onKeyUp = {getNoteData} name = "note_desc" placeholder = "description" className = "input" type = "text"/>
              </IonItem>
              <IonButton type = "submit" className = "mt-3 btnAdd">Add Note</IonButton>
          </IonCard> 
       </form>
      </IonContent>
    </IonPage>
  );
};

export default AddNote;
