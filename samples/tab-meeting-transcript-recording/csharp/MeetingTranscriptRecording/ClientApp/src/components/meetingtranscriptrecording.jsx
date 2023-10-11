/* eslint-disable array-callback-return */
// <copyright file="MeetingTranscriptRecording.jsx" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// </copyright>

import React, { useState, useEffect } from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import { Button, Text, Card } from '@fluentui/react-components';
import { CardBody } from 'reactstrap';


const MeetingTranscriptRecording = () => {

    // Variable stores the username of users who login using Facebook or SSO.
    const [userName, setUserName] = useState("");

    const [cardData, setData] = useState([]);

    // Declare new state variables that are required for a verified anonymous user or a normal user
    const [IsConsentButtonVisible, setIsConsentButtonVisible] = useState(false);

    const [IsLoginVisible, setIsLoginVisible] = useState(true);

    const [IsCardVisible, setIsCardVisible] = useState(false);


    useEffect(() => {
        microsoftTeams.app.initialize();
    }, [])

    // Tab sso authentication.
    const ssoAuthentication = () => {
        alert("Click");
        getClientSideToken()
            .then((clientSideToken) => {
                return getServerSideToken(clientSideToken);
            })
            .catch((error) => {
                if (error === "invalid_grant") {
                    // Display in-line button so user can consent
                    setIsConsentButtonVisible(true);
                }
            });
    }

    // Get client side token.
    const getClientSideToken = () => {
        return new Promise((resolve, reject) => {
            microsoftTeams.authentication.getAuthToken()
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject("Error getting token: " + error);
                });
        });
    }

    // Get server side token and user profile.
    const getServerSideToken = (clientSideToken) => {
        return new Promise((resolve, reject) => {
            microsoftTeams.app.getContext().then((context) => {
                fetch('/GetLoginUserInformation', {
                    method: 'get',
                    headers: {
                        "Content-Type": "application/text",
                        "Authorization": "Bearer " + clientSideToken
                    },
                    cache: 'default'
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.text();
                        } else {
                            reject(response.error);
                        }
                    })
                    .then((responseJson) => {
                        if (responseJson === "") {
                            setIsConsentButtonVisible(true);
                        }
                        else {
                            setIsLoginVisible(false);
                            setIsCardVisible(true);
                            let userDetails = JSON.parse(responseJson);
                            setData(userDetails)
                        }
                    });
            });
        });
    }

    // Request consent on implicit grant error.
    const requestConsent = () => {
        getToken()
            .then(data => {
                setIsConsentButtonVisible(false);
                getClientSideToken()
                    .then((clientSideToken) => {
                        return getServerSideToken(clientSideToken);
                    });
            });
    }
    // Get token for multi tenant.
    const getToken = () => {
        return new Promise((resolve, reject) => {
            microsoftTeams.authentication.authenticate({
                url: window.location.origin + "/auth-start",
                width: 600,
                height: 535
            })
                .then((result) => {
                    resolve(result);
                })
                .catch((reason) => {
                    reject(reason);
                });
        });
    }

    // Request consent on implicit grant error.
    const fetchrecordingtranscript = (onlineMeetingId, transcriptsId, recordingId) => () => {
        alert(recordingId);
    }

    return (
        <div className="">
            <div className="btnLogin">
                {IsLoginVisible &&
                    <>
                        <Button appearance="primary" onClick={ssoAuthentication}>Sign-In</Button>
                    </>
                }
                {/*<Text size={500} weight="semibold">{userName}</Text>*/}
                {IsConsentButtonVisible &&
                    <>
                        <div id="divError">Please click on consent button</div>
                        <Button appearance="primary" onClick={requestConsent}>Consent</Button>
                    </>
                }
            </div>
            <div className="mainCard">
                {IsCardVisible &&
                    <>
                        {cardData.map((element, index) => {
                            return (
                                <div key={index} className="divMainCard">
                                    <Card>
                                        <CardBody className="main1Card">
                                            <div>
                                                <svg className="calendarSVG" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 4V2.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M17 4V2.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M21.5 9H16.625H10.75M2 9H5.875" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M18 17C18 17.5523 17.5523 18 17 18C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16C17.5523 16 18 16.4477 18 17Z" fill="#1C274C"></path> <path d="M18 13C18 13.5523 17.5523 14 17 14C16.4477 14 16 13.5523 16 13C16 12.4477 16.4477 12 17 12C17.5523 12 18 12.4477 18 13Z" fill="#1C274C"></path> <path d="M13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17Z" fill="#1C274C"></path> <path d="M13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13Z" fill="#1C274C"></path> <path d="M8 17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17C6 16.4477 6.44772 16 7 16C7.55228 16 8 16.4477 8 17Z" fill="#1C274C"></path> <path d="M8 13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13C6 12.4477 6.44772 12 7 12C7.55228 12 8 12.4477 8 13Z" fill="#1C274C"></path> </g></svg>
                                                <Text className="txtMeetingTitle" weight='bold' as="h1">{element.subject}</Text>
                                            </div>
                                            <div>
                                                <Text className="meetingDate">{element.start} - {element.end} </Text>
                                            </div>
                                            <div>
                                                <Text className="organizerName">{element.organizer}</Text>
                                            </div>
                                            <div className="btnCard">
                                                <Button appearance="primary" onClick={fetchrecordingtranscript(element.onlineMeetingId,element.transcriptsId,element.recordingId)}>Fetch Recording & Transcript</Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            );
                        })}
                    </>
                }
            </div>
        </div>
    );
};

export default MeetingTranscriptRecording;
