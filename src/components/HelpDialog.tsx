import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tile } from './Tile';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">How To Play</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <p>Guess the Wordle in 6 tries.</p>
          
          <ul className="list-disc list-inside space-y-1">
            <li>Each guess must be a valid 5-letter word.</li>
            <li>The color of the tiles will change to show how close your guess was to the word.</li>
          </ul>
          
          <div className="border-t border-border pt-4">
            <p className="font-bold mb-3">Examples</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex gap-1 mb-2">
                  <Tile tile={{ letter: 'W', status: 'correct' }} />
                  <Tile tile={{ letter: 'E', status: 'filled' }} />
                  <Tile tile={{ letter: 'A', status: 'filled' }} />
                  <Tile tile={{ letter: 'R', status: 'filled' }} />
                  <Tile tile={{ letter: 'Y', status: 'filled' }} />
                </div>
                <p><strong>W</strong> is in the word and in the correct spot.</p>
              </div>
              
              <div>
                <div className="flex gap-1 mb-2">
                  <Tile tile={{ letter: 'P', status: 'filled' }} />
                  <Tile tile={{ letter: 'I', status: 'present' }} />
                  <Tile tile={{ letter: 'L', status: 'filled' }} />
                  <Tile tile={{ letter: 'L', status: 'filled' }} />
                  <Tile tile={{ letter: 'S', status: 'filled' }} />
                </div>
                <p><strong>I</strong> is in the word but in the wrong spot.</p>
              </div>
              
              <div>
                <div className="flex gap-1 mb-2">
                  <Tile tile={{ letter: 'V', status: 'filled' }} />
                  <Tile tile={{ letter: 'A', status: 'filled' }} />
                  <Tile tile={{ letter: 'G', status: 'filled' }} />
                  <Tile tile={{ letter: 'U', status: 'absent' }} />
                  <Tile tile={{ letter: 'E', status: 'filled' }} />
                </div>
                <p><strong>U</strong> is not in the word in any spot.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
