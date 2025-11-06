'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTableData } from '@/hooks/useTableData';
import { ColumnConfig } from '@/store/types';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';


import { 
  Box, 
  Paper, 
  Typography, 
  IconButton 
} from '@mui/material';

function SortableItem({ column }: { column: ColumnConfig }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        p: 1, 
        mb: 1,
        cursor: 'grab'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton 
          size="small" 
          {...listeners}
          sx={{ cursor: 'grab' }}
        >
          <DragIndicatorIcon />
        </IconButton>
        <Typography variant="body2" sx={{ ml: 1 }}>
          {column.label}
        </Typography>
      </Box>
      {column.required && (
        <Typography variant="caption" color="textSecondary">
          (required)
        </Typography>
      )}
    </Paper>
  );
}


export function ColumnReorder() {
  const { columns, preferences, reorderColumns } = useTableData();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = preferences.columnOrder.indexOf(active.id as string);
      const newIndex = preferences.columnOrder.indexOf(over.id as string);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const activeColumn = columns.find(col => col.id === active.id);
        
        if (activeColumn && !activeColumn.required) {
          const newOrder = arrayMove(
            preferences.columnOrder,
            oldIndex,
            newIndex
          );
          reorderColumns(newOrder);
        }
      }
    }
    
    setActiveId(null);
  };

  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => {
      const aIndex = preferences.columnOrder.indexOf(a.id);
      const bIndex = preferences.columnOrder.indexOf(b.id);
      return aIndex - bIndex;
    });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(event.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={visibleColumns.map(col => col.id)}
        strategy={verticalListSortingStrategy}
      >
        <Box>
          {visibleColumns.map((column) => (
            <SortableItem key={column.id} column={column} />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}