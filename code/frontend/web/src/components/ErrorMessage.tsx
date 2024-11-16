import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className="flex items-center text-errorColor text-xs mt-2">
            <FontAwesomeIcon icon={faTimesCircle} className="mr-2 text-errorColor"/>
            <span>{message}</span>
        </div>
    );
};

export default ErrorMessage;
