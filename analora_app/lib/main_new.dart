import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Analora App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.brown),
        useMaterial3: true,
      ),
      home: const WebViewHomePage(),
    );
  }
}

class WebViewHomePage extends StatefulWidget {
  const WebViewHomePage({super.key});

  @override
  State<WebViewHomePage> createState() => _WebViewHomePageState();
}

class _WebViewHomePageState extends State<WebViewHomePage> {
  late final WebViewController _controller;
  bool _isLoading = true;
  int _progress = 0;
  Timer? _autoReloadTimer;
  static const String _initialUrl = 'http://192.168.100.11:5500';

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (progress) {
            setState(() {
              _progress = progress;
            });
          },
          onPageStarted: (url) {
            setState(() {
              _isLoading = true;
            });
          },
          onPageFinished: (url) {
            setState(() {
              _isLoading = false;
              _progress = 100;
            });
          },
          onWebResourceError: (error) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('حدث خطأ أثناء تحميل الصفحة: ${error.description}'),
              ),
            );
          },
        ),
      )
      ..loadRequest(Uri.parse(_initialUrl));

    _autoReloadTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      _controller.reload();
    });
  }

  @override
  void dispose() {
    _autoReloadTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      extendBody: true,
      body: Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (_isLoading)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: LinearProgressIndicator(
                value: _progress / 100,
                color: Theme.of(context).colorScheme.primary,
                backgroundColor: Colors.white.withOpacity(0.3),
                minHeight: 6,
              ),
            ),
        ],
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 20.0),
        child: ElevatedButton.icon(
          onPressed: () {
            _controller.reload();
          },
          icon: const Icon(Icons.refresh, size: 28),
          label: const Text(
            'تحديث',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(32),
            ),
            backgroundColor: Colors.brown,
            elevation: 10,
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
