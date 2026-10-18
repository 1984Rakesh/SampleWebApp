import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Paper elevation={0} sx={{ overflow: 'hidden', bgcolor: 'grey.900' }}>
      {title && (
        <Box sx={{ bgcolor: 'grey.800', px: 2, py: 1, borderBottom: 1, borderColor: 'grey.700' }}>
          <Typography variant="body2" fontWeight={500} color="grey.300">
            {title}
          </Typography>
        </Box>
      )}
      <Box position="relative">
        <Button
          onClick={copyToClipboard}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'grey.700',
            color: 'grey.300',
            textTransform: 'none',
            '&:hover': { bgcolor: 'grey.600' },
          }}
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Box component="pre" sx={{ p: 2, overflow: 'auto', m: 0 }}>
          <Box component="code" className={`language-${language}`} sx={{ fontSize: '0.875rem', color: 'grey.100' }}>
            {code}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
