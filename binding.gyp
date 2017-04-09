{
  'variables': {
    'platform': '<(OS)',
    'linux_platform': '<!(scripts/get_linux_platform)'
  },
  'conditions': [
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
        ['linux_platform=="rpi"',
          {
            'defines': [
              'NWGL_RASPBERRY_PI'
            ],
            'libraries': ['-lGLESv2'],
            'include_dirs': ['/opt/vc/include'],
            'library_dirs': ['/opt/vc/lib']
          }
        ],
        ['linux_platform=="linux"',
          {
            'libraries': ['-lGLEW','-lGL']
          }
        ],
        ['OS=="mac"',
          {
            'libraries': ['-lGLEW','-framework OpenGL'],
            'include_dirs': ['/usr/local/include'],
            'library_dirs': ['/usr/local/lib']
          }
        ],
        ['OS=="win32"',
          {
            'include_dirs': [
              './deps/include',
            ],
            'library_dirs': [
              './deps/windows/lib/<(target_arch)',
            ],
            'libraries': [
              'glew32.lib',
              'opengl32.lib',
              'FreeImage.lib'
            ],
            'defines' : [
              'WIN32_LEAN_AND_MEAN',
              'VC_EXTRALEAN'
            ],
            'msvs_settings' : {
              'VCCLCompilerTool' : {
                'AdditionalOptions' : ['/O2','/Oy','/GL','/GF','/Gm-','/EHsc','/MT','/GS','/Gy','/GR-','/Gd']
              },
              'VCLinkerTool' : {
                'AdditionalOptions' : ['/OPT:REF','/OPT:ICF','/LTCG']
              },
            }
          }
        ]
      ],
    }
  ]
}
