'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

const DeleteDialogBox = ({ title, description, disable, onDelete }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='text-destructive'>
          <Trash2 className='mr-2 h-3 w-3' />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className='flex justify-end mt-4 gap-4'>
            <Button
              variant='destructive'
              size='sm'
              className=''
              disabled={disable}
              onClick={onDelete}
            >
              <Trash2 className='mr-2 h-3 w-3' />
              Delete
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='text-muted-foreground'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialogBox;
