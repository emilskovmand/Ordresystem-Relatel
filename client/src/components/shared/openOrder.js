import { useState, useRef, useEffect, useCallback } from 'react'
import { UpdateSingleOrder, DeleteOrders, DeleteOrderFromSystem, GetComments, AddComment, ListenForKey } from '../../services/orderService'
import { UploadAudio, GetOrderRecordings } from '../../services/audioService'
import { useAPINotifier } from '../context/MessageReceiver'
import { useAuth } from '../context/auth'
import ReactLoading from 'react-loading'

const Recording = ({ audioPath, id, orderId, filename, parentAction, parentDownload }) => {
    const [playing, setPlaying] = useState(false);

    const audioTag = useRef();
    const downloadTag = useRef();

    const beginPlaying = () => {
        setPlaying(true);
        audioTag.current.play();
    }

    const stopPlaying = () => {
        setPlaying(false);
        audioTag.current.pause();
        audioTag.current.currentTime = 0;
    }

    const downloadFile = () => {
        downloadTag.current.click();
    }

    return (
        <>
            <div className="RecordingContainer">
                <audio onEnded={() => setPlaying(false)} ref={audioTag} src={audioPath} />

                <div className="visual">
                    <i onClick={() => parentAction(audioPath, true)} className="fa fa-trash trashcan" aria-hidden="true"></i>
                    <span>{filename}</span>
                    {playing && <>
                        <i onClick={stopPlaying} className="fas fa-pause"></i>
                    </>}
                    {!playing && <>
                        <i onClick={beginPlaying} className="fas fa-play"></i>
                    </>}
                    <i onClick={downloadFile} className="fa fa-download"></i>
                    <a ref={downloadTag} href={(audioPath)} style={{ display: "none" }} download />
                    <a ref={a => parentDownload(a)} href={(audioPath)} style={{ display: "none" }} download />
                </div>

            </div>
        </>
    )
}

const Narration = ({ text = "No text", orderId, index, updateMe }) => {
    const [playing, setPlaying] = useState(false);

    const textTag = useRef();

    const updateThisComponent = () => {
        updateMe(index, textTag.current.value);
    }

    useEffect(() => {

        return () => {

        }
    }, [playing])

    return (
        <>
            <div className="Narrationcontainer">
                <p>Indtalelse: {index + 1}</p>
                <div className="textWrapper">
                    <textarea onChange={updateThisComponent} ref={textTag} defaultValue={text}></textarea>
                </div>
            </div>
        </>
    )
};


const Comment = ({ username, left = true, date, text }) => {
    return (
        <>
            <div className="commentContainer">
                <div className={`commentWrapper ${left ? "left" : "right"}`}>
                    <div className="comment">
                        <h6>{username} - {date.substring(0, 10)}</h6>
                        <p>{text}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function OpenOrder({ _id, OrdreId, recordingId, BestillingsDato, Virksomhed, Kundenavn, AntalIndtalinger, ValgteSpeaker, Status, setEditState, editState, trashbin = false }) {
    const [closing, Close] = useState(false);
    const { AddMessage } = useAPINotifier();
    const [comments, setComments] = useState(null);
    const [recordings, setRecordings] = useState(null);
    const [soundFiles, setSoundFiles] = useState([]);
    const [AudioCount, setAudioCount] = useState(AntalIndtalinger);
    let auth = useAuth();

    const uploadInput = useRef();
    const downloadTags = useRef([]);

    const inputs = useRef({});
    const errorBox = useRef();

    const commentBox = useRef();
    const commentText = useRef();

    let newStatus = "";

    const closeAction = () => {
        Close(true);
        setTimeout(() => {
            setEditState({}, true)
        }, 350);
    }

    if (Status === "Ny Ordre") newStatus = "Under Produktion";
    else if (Status === "Under Produktion") newStatus = "Godkend Produktion";
    else if (Status === "Godkend Produktion") newStatus = "Færdig & Sendt";

    const updateOrder = async (orderStatus = Status) => {
        const notValidFields = [];
        // Check each field
        if (inputs.current.virksomhed.value.length === 0) {
            notValidFields.push("Virksomhed");
        }
        if (inputs.current.kundenavn.value.length === 0) {
            notValidFields.push("Kundenavn");
        }
        if (inputs.current.indtalinger.value > 6 || /[a-zA-Z]/g.test(inputs.current.indtalinger.value) || inputs.current.indtalinger.value.length === 0) {
            notValidFields.push("Antal Indtalinger")
        }
        if (inputs.current.speaker.value.length === 0) {
            notValidFields.push("Valgte Speaker");
        }

        // if any validation errors occured
        if (notValidFields.length > 0) {
            errorBox.current.innerText = "Ugyldige felter: " + notValidFields;
            errorBox.current.style = "display: block;"
            return;
        } else {

            UpdateSingleOrder(
                _id,
                OrdreId,
                inputs.current.dato.value,
                inputs.current.virksomhed.value,
                inputs.current.kundenavn.value,
                inputs.current.indtalinger.value,
                inputs.current.speaker.value,
                orderStatus,
                false,
                { Id: recordingId, array: recordings, audio: soundFiles }
            ).then((res) => {
                res[0].then((val) => {
                    AddMessage(val, res[1]);
                })
            })

            closeAction();
        }
    }

    const updateAudioCount = () => {
        if (inputs.current.indtalinger.value <= 10) {
            setAudioCount(parseInt(inputs.current.indtalinger.value));
        } else {
            inputs.current.indtalinger.value = 10
        }
    }

    const updateRecordingFromChild = (index, text) => {
        var recordingArray = [...recordings];
        recordingArray[index].text = text;

        setRecordings(recordingArray);
    };

    const soundFileFromChild = (key, deleteAction = false) => {
        if (deleteAction) {
            var soundFileArray = [...soundFiles];
            soundFileArray.splice(soundFileArray.findIndex((v) => v.url === key), 1);
            setSoundFiles(soundFileArray);
        }
    }

    const upload = () => {
        if (uploadInput.current.files[0]) {
            UploadAudio(
                OrdreId,
                uploadInput.current.files[0]
            ).then((res) => {
                var newArray = [...soundFiles];
                newArray.push(res[0].data);
                setSoundFiles(newArray);
            })
        }
    }

    const narrationComponents = (count = 1) => {
        var array = [];
        for (let i = 0; i < count; i++) {
            const recordingfromArray = recordings !== null ? recordings[i] : { text: '', url: '' }
            array.push(<Narration
                key={i}
                index={i}
                orderId={_id}
                text={recordingfromArray.text}
                down
                updateMe={updateRecordingFromChild}
            />)
        }

        return array;
    }

    const recordingsComponents = (sf) => {
        var array = [];
        if (sf) {
            for (let i = 0; i < sf.length; i++) {
                array.push(<Recording
                    key={i}
                    index={i}
                    audioPath={sf[i].url}
                    filename={sf[i].name}
                    parentAction={soundFileFromChild}
                    parentDownload={el => downloadTags.current[i] = el}
                />)
            }
        }

        if (array.length === 0) {
            array.push(<div key={1} id="noSound">Ingen lydfiler uploadet.</div>)
        }

        return array;
    }

    const downloadAllFiles = () => {
        downloadTags.current.forEach(element => {
            element.click();
        });
    }

    const remakeOrder = () => {
        UpdateSingleOrder(
            _id,
            OrdreId,
            inputs.current.dato.value,
            inputs.current.virksomhed.value,
            inputs.current.kundenavn.value,
            inputs.current.indtalinger.value,
            inputs.current.speaker.value,
            Status,
            false,
            { Id: recordingId, array: recordings, audio: soundFiles }
        )
        closeAction();
    }

    const permanentlyDelete = () => {
        DeleteOrderFromSystem([_id]);
        closeAction();
    }

    const deleteOrder = () => {
        DeleteOrders([_id]);
        closeAction();
    }

    const getRecordings = useCallback(() => {
        GetOrderRecordings(recordingId).then((val) => {
            var arrayForState = [];
            for (let i = 0; i < 10; i++) {
                var currentRecording = val.recordings !== undefined ? val.recordings[i] : null;

                if (currentRecording) {
                    arrayForState.push({
                        text: currentRecording.text
                    });
                } else {
                    arrayForState.push({
                        text: ""
                    });
                }
            }

            setSoundFiles(val.audio);
            setRecordings(arrayForState);
        });
    }, [recordingId])

    const getOrderComments = useCallback(() => {
        GetComments(_id).then((val) => {
            setComments(val);
        });
    }, [_id])

    const addComment = async () => {
        if (commentText.current.value.length < 1) return;

        await AddComment(_id, commentText.current.value);
        commentText.current.value = "";

        getOrderComments();
    };


    useEffect(() => {
        // effect
        getOrderComments();
        getRecordings();
        return () => {
            // cleanup
        }
    }, [getOrderComments, getRecordings])


    return (
        <>
            <div id="EditModal" className={`openOrder ${(closing) ? " close" : ""}`}>
                <div className="modalWrapper">
                    <div className={`modalContainer${(closing) ? " close" : ""}`}>
                        {!trashbin && <i id="trashcan" className="fa fa-trash" aria-hidden="true" onClick={() => deleteOrder()} ></i>}
                        <h4>OrdreId: {OrdreId}</h4>
                        <p>{_id}</p>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="Bestillingsdato">BestillingsDato</label>
                            </div>
                            <input ref={input => inputs.current.dato = input} name="Bestillingsdato" type="datetime-local" defaultValue={BestillingsDato}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="Virksomhed">Virksomhed</label>
                            </div>
                            <input ref={input => inputs.current.virksomhed = input} name="Virksomhed" type="text" defaultValue={Virksomhed}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="kundenavn">Kundenavn</label>
                            </div>
                            <input ref={input => inputs.current.kundenavn = input} name="kundenavn" type="text" defaultValue={Kundenavn}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="indtalinger">Antal Indtalinger</label>
                            </div>
                            <input ref={input => inputs.current.indtalinger = input} name="indtalinger" onChange={updateAudioCount} type="number" min="1" max="10" maxLength="2" defaultValue={AntalIndtalinger}></input>
                        </div>
                        <div className="inputField">
                            <div className="labelfield">
                                <label htmlFor="valgteSpeaker">Valgte Speaker</label>
                            </div>
                            <input ref={input => inputs.current.speaker = input} name="valgteSpeaker" type="text" defaultValue={ValgteSpeaker}></input>
                        </div>

                        <div className="statusContainer">
                            <p>Nuværende status: <span className={Status.replace(/\s+/g, '').replace('&', '')}>{Status}</span></p>
                        </div>

                        <p ref={p => errorBox.current = p} className="errorMessage"></p>

                        <section id="AudioNarrationSection">
                            {narrationComponents(AudioCount)}
                            {recordingsComponents(soundFiles)}

                            <div className="maj-AudioButtons">
                                <button id="uploadButton" onClick={() => uploadInput.current.click()}>Upload Lyd</button>
                                <input onChange={upload} id="uploadFile" ref={uploadInput} style={{ display: 'none' }} accept="audio/mp3,audio/*;capture=microphone" type="file" />
                                <button id="downloadAll" onClick={downloadAllFiles}><i className="fa fa-download"></i> Download alle</button>

                            </div>
                        </section>

                        {!trashbin && <div className="buttonsContainer">
                            {Status !== 'Færdig & Sendt' && <>
                                <button onClick={() => updateOrder(newStatus)} className="nextButton">
                                    {Status === "Ny Ordre" && <>Send til produktion</>}
                                    {Status === "Under Produktion" && <>Produceret</>}
                                    {Status === "Godkend Produktion" && <>Godkend</>}
                                </button>
                                <button onClick={() => updateOrder()} className="submitButton">
                                    Opdater Ordre
                            </button>
                            </>}
                            <button onClick={() => setEditState({}, false)} className={`cancelButton ${(Status === 'Færdig & Sendt') ? "closeButton" : ""}`}>
                                {Status === 'Færdig & Sendt' ? <>Luk</> : <>Annuller</>}
                            </button>
                        </div>}

                        {trashbin && <div className="buttonsContainer">
                            <button onClick={() => remakeOrder()} className="genskabButton">Genskab Ordre</button>
                            <button onClick={() => permanentlyDelete()} className="deleteButton">Slet Permanent</button>
                            <button onClick={() => setEditState({}, false)} className={`cancelButton`}>
                                Annuller
                            </button>
                        </div>}
                    </div>

                </div>

                <section id="commentsection">
                    <div className="commentContainer">
                        <div className="commentWrapper">
                            <div ref={div => commentBox.current = div} className="commentsBox">
                                {comments && comments.map((val, index) => {
                                    return <Comment
                                        key={val._id}
                                        text={val.message}
                                        username={val.username}
                                        date={val.date}
                                        index={index}
                                        left={(val.username !== auth.user.user.username)}
                                    />
                                })}

                                {comments && comments.length === 0 && <div className="nomessageText">
                                    <p>Ingen beskeder at hente.</p>
                                </div>}

                                {!comments && <>
                                    <div className="loaderWrapper">
                                        <ReactLoading type={"spin"} height={30} width={30} color={"black"} />
                                    </div>
                                </>}
                            </div>
                            <div className="createComment">
                                <textarea onKeyDown={(ev) => ListenForKey(ev, 'Enter', addComment)} ref={textarea => commentText.current = textarea} placeholder="Skriv en kommentar.."></textarea>
                                <button onClick={addComment}>Tilføj kommentar</button>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </>
    )
}