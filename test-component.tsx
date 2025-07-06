'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';

export default function TestComponent() {
  return (
    <div>
      <Header />
      <div className="min-h-screen">
        <h1>Test</h1>
      </div>
    </div>
  );
}
