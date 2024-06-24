import * as React from 'react';
import Button from '@mui/material/Button';

export default function ReactButton() {
    return (
        <Button variant="contained" onClick={() => methodDoesNotExist()}>
            Break the world
        </Button>
    );
}
