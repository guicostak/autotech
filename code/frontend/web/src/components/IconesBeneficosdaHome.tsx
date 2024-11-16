import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTruckFast, faComments, faShield } from '@fortawesome/free-solid-svg-icons';

const IconesBeneficosdaHome: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', gap: '140px' }}>
      <div style={{ textAlign: 'center', color: '#2A2C2F', margin: '0 5px' }}>
        <FontAwesomeIcon icon={faCreditCard} size="2x" />
        <h3 style={{ fontSize: '1.2em', color: '#2A2C2F' }}>PARCELAMENTO</h3>
        <p style={{ color: '#DE3450' }}>Em até 12x sem juros</p>
      </div>
      <div style={{ textAlign: 'center', color: '#2A2C2F', margin: '0 5px' }}>
        <FontAwesomeIcon icon={faTruckFast} size="2x" />
        <h3 style={{ fontSize: '1.2em', color: '#2A2C2F' }}>COMPRE NO SITE</h3>
        <p style={{ color: '#DE3450' }}>Receba na porta de casa</p>
      </div>
      <div style={{ textAlign: 'center', color: '#2A2C2F', margin: '0 5px' }}>
        <FontAwesomeIcon icon={faComments} size="2x" />
        <h3 style={{ fontSize: '1.2em', color: '#2A2C2F' }}>RECOMENDADA</h3>
        <p style={{ color: '#DE3450' }}>Loja que combina com o cliente</p>
      </div>
      <div style={{ textAlign: 'center', color: '#2A2C2F', margin: '0 5px' }}>
        <FontAwesomeIcon icon={faShield} size="2x" />
        <h3 style={{ fontSize: '1.2em', color: '#2A2C2F' }}>LOJA 100% SEGURA</h3>
        <p style={{ color: '#DE3450' }}>Compre com segurança</p>
      </div>
    </div>
  );
};

export default IconesBeneficosdaHome;
