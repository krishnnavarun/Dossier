import { render,screen } from '@testing-library/react';
import { describe,expect,it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
describe('home page',()=>{it('introduces the mystery room and exposes the create action',()=>{render(<BrowserRouter><App/></BrowserRouter>);expect(screen.getByRole('heading',{name:/some stories are waiting to be solved/i})).toBeInTheDocument();expect(screen.getByRole('link',{name:/create your mystery/i})).toHaveAttribute('href','/create')})});
