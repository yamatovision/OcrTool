import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Grid, Paper, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { UploadedFile } from '../../types';
import { styled } from '@mui/material/styles';

const ImageContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  '&:hover': {
    '& .delete-button': {
      opacity: 1,
    },
  },
}));

const ImagePreview = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
});

const DeleteButton = styled(IconButton)({
  position: 'absolute',
  top: 4,
  right: 4,
  opacity: 0,
  transition: 'opacity 0.2s',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

interface ImageListProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export const ImageList: React.FC<ImageListProps> = ({ files, onRemove, onReorder }) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="image-list" direction="horizontal">
        {(provided) => (
          <Grid
            container
            spacing={2}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {files.map((file, index) => (
              <Draggable key={file.id} draggableId={file.id} index={index}>
                {(provided) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <ImageContainer elevation={2}>
                      <div {...provided.dragHandleProps}>
                        <DragIndicatorIcon color="action" />
                      </div>
                      <Typography variant="caption" display="block">
                        {file.file.name}
                      </Typography>
                      <ImagePreview src={file.preview} alt={file.file.name} />
                      <DeleteButton
                        size="small"
                        className="delete-button"
                        onClick={() => onRemove(file.id)}
                      >
                        <DeleteIcon />
                      </DeleteButton>
                    </ImageContainer>
                  </Grid>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Grid>
        )}
      </Droppable>
    </DragDropContext>
  );
};
