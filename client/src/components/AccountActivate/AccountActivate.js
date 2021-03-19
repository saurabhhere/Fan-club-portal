import axios from 'axios';
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import url from '../../misc/url';
import { toast } from 'react-toastify';
import './AccountActivate.css';

const AccountActivate = () => {

    const { token } = useParams();
    const [status, setStatus] = useState(false);

    const history = useHistory();

    const activateReq = async (e) => {
        await axios.post(`${url.serverURL}/user/email-activate`, {token})
        .then((res) => {
            accountActivateToast();
            setStatus(true);
            history.push('/user/login');
        }).catch((error) => {
            console.log(error);
        })
    }

    const accountActivateToast = () => {
        toast.success('Account activated successfully!', {position: toast.POSITION.TOP_CENTER});
    }

    return (
        <div className="account-activate">
        {   
            status ? (
                <div>
                    Your Account Activated Successfully
                </div>
            ) : (   
                    <div className="account-activate-flex">
                        <div>Please Click on below button to activate your account</div>
                        <div className="activate-btn" onClick={activateReq}>Activate account</div>
                    </div>
            )
        }
        </div>
    )
}

export default AccountActivate
