import React from 'react';
import { type Props } from './use';

const Foo: React.FC<Props> = ({ message }) => {
  return <h1>{message}</h1>;
};

export default Foo;
