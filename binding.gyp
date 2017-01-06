{
  'variables': {
    'platform': '<(OS)',
  },
  'conditions': [
    # Replace gyp platform with node platform, blech
    ['platform == "mac"', {'variables': {'platform': 'darwin'}}],
    ['platform == "win"', {'variables': {'platform': 'win32'}}],
  ],
  'targets': [
    {
      'target_name': 'webgl',
      'defines': [
        'VERSION=0.5.5'
      ],
      'sources': [
          'src/bindings.cc',
          'src/webgl.cc',
      ],
      'include_dirs': [
        "<!(node -e \"require('nan')\")"
      ],
      'conditions': [
        ['OS=="linux"',
          {
            'libraries': ['-lGLESv2'],
            'include_dirs': ['/opt/vc/include'],
            'library_dirs': ['/opt/vc/lib']
          }
        ],
      ],
    }
  ]
}
