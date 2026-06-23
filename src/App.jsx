import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fdf2f8',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '40px 20px',
    color: '#000'
  },
  wrapper: {
    maxWidth: 700,
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
    color: '#be185d'
  },
  subtitle: {
    fontSize: 14,
    color: '#9d174d',
    marginTop: 8
  },
  tabs: {
    display: 'flex',
    gap: 12,
    marginBottom: 30,
    justifyContent: 'center'
  },
  tab: {
    padding: '8px 16px',
    borderRadius: 8,
    border: '1px solid #fbcfe8',
    backgroundColor: '#fff',
    color: '#000',
    cursor: 'pointer',
    fontSize: 14
  },
  tabActive: {
    backgroundColor: '#ec4899',
    color: '#fff',
    border: '1px solid #ec4899'
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    border: '1px solid #fbcfe8',
    marginBottom: 30
  },
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: '1px solid #f9a8d4',
    borderRadius: 8,
    marginBottom: 12,
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#000'
  },
  textarea: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: '1px solid #f9a8d4',
    borderRadius: 8,
    minHeight: 120,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    color: '#000'
  },
  button: {
    marginTop: 12,
    marginRight: 8,
    padding: '10px 20px',
    backgroundColor: '#ec4899',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    color: '#be185d',
    border: '1px solid #fbcfe8'
  },
  entry: {
    backgroundColor: '#fff',
    padding: 20,
    border
