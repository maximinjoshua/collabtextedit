import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Grid, Container,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box
} from '@mui/material';
import { get } from '../../services/apiClient';

const getRandomColor = () => {
  const colors = [
    '#FF6F61', '#6B5B95', '#88B04B', '#FFA500', '#00BFFF', '#FF1493',
    '#20B2AA', '#9370DB', '#FF4500', '#008080', '#DA70D6', '#40E0D0',
    '#DC143C', '#00CED1', '#FF8C00', '#4682B4', '#9ACD32', '#C71585',
    '#5F9EA0', '#D2691E'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const HomePage = () => {
  const [documents, setDocuments] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAddClick = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewTitle('');
  };

  const getDocuments = async() => {
    try{
      const response = await fetch('http://localhost:3000/documents', {
        method: 'GET'
      });
      if (response.ok) {
        // const message = await response.text();
        // alert(message);
        const data = await response.json()
        console.log(data, "Data")
        setDocuments(data)
      }else {
        const error = await response.text();
        alert(`Document fetch Failed: ${error}`);
      }
    }catch (err) {
      console.error('Document create error:', err);
      alert('Something went wrong. Please try again later.');
    }
  }

  const handleCreate = async () => {

    try {
      const response = await fetch('http://localhost:3000/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: newTitle})
      });

      if (response.ok) {
        // const message = await response.text();
        // alert(message); // "Login Successful"
        // navigate('/')
        getDocuments()
      } else {
        const error = await response.text();
        alert(`Document Creation Failed: ${error}`);
      }
    } catch (err) {
      console.error('Document create error:', err);
      alert('Something went wrong. Please try again later.');
    }

    handleClose()
    // if (newTitle.trim()) {
    //   const newDoc = {
    //     id: `doc-${documents.length + 1}`,
    //     title: newTitle
    //   };
    //   setDocuments([...documents, newDoc]);
    //   handleClose();
    // }
  };

  useEffect(()=>{
    getDocuments()
  },[])

  return (
    <Container sx={{ marginTop: 4, position: 'relative' }}>
      {/* Add Document Button */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add Document
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Collaborative Documents
      </Typography>

      <Grid container spacing={3}>
        {documents && documents.map((doc) => {
          const borderColor = getRandomColor();
          return (
            <Grid item xs={12} sm={6} md={4} key={doc.id} sx={{ minWidth: "350px", minHeight: "250px" }}>
              <a href={`/editor/${doc.id}`} style={{ textDecoration: 'none' }}>
                <Card sx={{ height: '100%', cursor: 'pointer', border: '2px solid', borderColor }}>
                  <CardContent>
                    <Typography variant="h6">{doc.title}</Typography>
                  </CardContent>
                </Card>
              </a>
            </Grid>
          );
        })}
      </Grid>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Document Title"
            fullWidth
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleCreate} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;
