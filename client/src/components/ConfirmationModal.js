import React from 'react'

function ConfirmationModal({ show, message, onCancel, onConfirm, loggedOut, loggedOutMessage, logoutError }) {
    if (!show) return null;


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {!logoutError && (
                    <>
                        <p>{loggedOut ? loggedOutMessage : message}</p>
                        {!loggedOut && (
                            <>
                                <button onClick={onConfirm}>Confirm</button>
                                <button onClick={onCancel}>Cancel</button>
                            </>
                        )}

                    </>
                )}
                {logoutError && (
                    <p>An error has occured.</p>
                )}
            </div>
        </div>
    )
}

export default ConfirmationModal
